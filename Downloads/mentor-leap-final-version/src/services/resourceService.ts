import { db, admin } from "@/lib/firebaseAdmin";
import { Resource, ResourceCategory } from "@/models/Resource";

export const ResourceService = {
    async uploadResource(data: Omit<Resource, "id" | "createdAt">) {
        const resourceRef = db.collection("resources").doc();
        const resourceData = {
            ...data,
            id: resourceRef.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await resourceRef.set(resourceData);
        return resourceData;
    },

    async getResources() {
        const snapshot = await db.collection("resources").orderBy("createdAt", "desc").get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as Resource);
    },

    async getResourcesByCategory(category: ResourceCategory) {
        const snapshot = await db
            .collection("resources")
            .where("category", "==", category)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as Resource);
    },

    async deleteResource(id: string) {
        await db.collection("resources").doc(id).delete();
    },
};
