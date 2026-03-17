import { db, admin } from "@/lib/firebaseAdmin";
import { Transaction } from "@/models/Transaction";

export const TransactionService = {
    async createTransaction(data: Omit<Transaction, "id" | "createdAt" | "paymentStatus">) {
        const transRef = db.collection("transactions").doc();
        const transData = {
            ...data,
            id: transRef.id,
            paymentStatus: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await transRef.set(transData);
        return transData;
    },

    async updateTransactionStatus(transactionId: string, status: "success" | "failed") {
        const transRef = db.collection("transactions").doc(transactionId);
        await transRef.update({ paymentStatus: status });

        // If success, fulfill the order (e.g., enroll in course)
        if (status === "success") {
            const doc = await transRef.get();
            const transaction = doc.data() as Transaction;
            if (transaction.itemType === "course") {
                await db.collection("users").doc(transaction.userId).update({
                    enrolledCourses: admin.firestore.FieldValue.arrayUnion(transaction.itemId),
                });
            }
        }
    },

    async getUserTransactions(uid: string) {
        const snapshot = await db
            .collection("transactions")
            .where("userId", "==", uid)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc: any) => doc.data() as Transaction);
    },
};
