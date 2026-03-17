import { admin } from "@/lib/firebaseAdmin";

export type EventType = "bootcamp" | "masterclass" | "webinar";

export interface Event {
    id?: string;
    title: string;
    description: string;
    type: EventType;
    date: admin.firestore.Timestamp | Date;
    price: number;
    speaker: string;
    seats: number;
    banner: string; // Cloudinary URL
    googleMeetLink: string;
    attendees: string[]; // Array of user UIDs
    createdAt: admin.firestore.Timestamp | Date;
}
