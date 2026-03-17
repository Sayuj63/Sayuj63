import { db, auth, admin } from "@/lib/firebaseAdmin";
import { User } from "@/models/User";

export const UserService = {
    async createUser(uid: string, data: Partial<User>) {
        const userRef = db.collection("users").doc(uid);
        const isAdminEmail = data.email === "admin@mentorleap.com";
        const userData = {
            ...data,
            uid,
            role: isAdminEmail ? "admin" : (data.role || "student"),
            enrolledCourses: data.enrolledCourses || [],
            registeredEvents: data.registeredEvents || [],
            certificates: data.certificates || [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (isAdminEmail) {
            await auth.setCustomUserClaims(uid, { role: "admin" });
        }
        await userRef.set(userData);
        return userData;
    },

    async getUser(uid: string) {
        const doc = await db.collection("users").doc(uid).get();
        return doc.exists ? ({ uid: doc.id, ...doc.data() } as User) : null;
    },

    async updateUser(uid: string, data: Partial<User>) {
        await db.collection("users").doc(uid).update(data);
    },

    async getAllUsers() {
        const snapshot = await db.collection("users").get();
        return snapshot.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() }) as User);
    },

    async assignAdminRole(uid: string) {
        await auth.setCustomUserClaims(uid, { role: "admin" });
        await db.collection("users").doc(uid).update({ role: "admin" });
    },

    async deleteUser(uid: string) {
        // 1. Delete from Firestore
        await db.collection("users").doc(uid).delete();
        // 2. Delete from Firebase Auth
        try {
            await auth.deleteUser(uid);
        } catch (error) {
            console.warn("User already deleted from Auth or does not exist");
        }
    }
};
