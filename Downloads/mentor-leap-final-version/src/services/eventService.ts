import { db, admin } from "@/lib/firebaseAdmin";
import { Event } from "@/models/Event";

export const EventService = {
    async createEvent(data: Omit<Event, "id" | "createdAt" | "attendees">) {
        const eventRef = db.collection("events").doc();
        const eventData = {
            ...data,
            id: eventRef.id,
            date: data.date ? admin.firestore.Timestamp.fromDate(new Date(data.date as any)) : admin.firestore.FieldValue.serverTimestamp(),
            attendees: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await eventRef.set(eventData);
        return eventData;
    },

    async registerForEvent(eventId: string, uid: string) {
        await db.collection("events").doc(eventId).update({
            attendees: admin.firestore.FieldValue.arrayUnion(uid),
        });
        await db.collection("users").doc(uid).update({
            registeredEvents: admin.firestore.FieldValue.arrayUnion(eventId),
        });
    },

    async getEvents() {
        const snapshot = await db.collection("events").orderBy("date", "asc").get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as Event);
    },

    async getEvent(eventId: string) {
        const doc = await db.collection("events").doc(eventId).get();
        return doc.exists ? ({ id: doc.id, ...doc.data() } as Event) : null;
    },

    async updateEvent(eventId: string, data: Partial<Event>) {
        await db.collection("events").doc(eventId).update(data);
    },

    async deleteEvent(eventId: string) {
        await db.collection("events").doc(eventId).delete();
    },
};
