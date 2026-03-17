import { db, admin } from "@/lib/firebaseAdmin";
import { Category } from "@/models/Category";

export const CategoryService = {
    async getAllCategories() {
        const snapshot = await db.collection("categories").orderBy("name", "asc").get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as Category);
    },

    async createCategory(data: Omit<Category, "id" | "courseCount" | "createdAt">) {
        const categoryRef = db.collection("categories").doc();
        const categoryData = {
            ...data,
            id: categoryRef.id,
            courseCount: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await categoryRef.set(categoryData);
        return categoryData;
    },

    async updateCategory(id: string, data: Partial<Category>) {
        await db.collection("categories").doc(id).update(data);
    },

    async deleteCategory(id: string) {
        await db.collection("categories").doc(id).delete();
    }
};
