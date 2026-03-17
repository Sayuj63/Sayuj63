import { db, admin } from "@/lib/firebaseAdmin";

export const RevisionService = {
    async logRevision(type: "course" | "category" | "event", id: string, oldData: any, newData: any, adminUid: string) {
        await db.collection("revisions").add({
            type,
            targetId: id,
            oldData,
            newData,
            adminUid,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    },

    async getHistory(id: string) {
        const snapshot = await db.collection("revisions")
            .where("targetId", "==", id)
            .orderBy("timestamp", "desc")
            .get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }
};
