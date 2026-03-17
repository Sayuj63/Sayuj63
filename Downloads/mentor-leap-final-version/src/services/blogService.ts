import { db, admin } from "@/lib/firebaseAdmin";
import { Blog } from "@/models/Blog";

export const BlogService = {
    async createBlog(data: Omit<Blog, "id" | "createdAt">) {
        const blogRef = db.collection("blogs").doc();
        const blogData = {
            ...data,
            id: blogRef.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await blogRef.set(blogData);
        return blogData;
    },

    async updateBlog(blogId: string, data: Partial<Blog>) {
        await db.collection("blogs").doc(blogId).update(data);
    },

    async deleteBlog(blogId: string) {
        await db.collection("blogs").doc(blogId).delete();
    },

    async getBlogs() {
        const snapshot = await db.collection("blogs").orderBy("createdAt", "desc").get();
        return snapshot.docs.map((doc: any) => doc.data() as Blog);
    },

    async getBlog(blogId: string) {
        const doc = await db.collection("blogs").doc(blogId).get();
        return doc.exists ? (doc.data() as Blog) : null;
    },
};
