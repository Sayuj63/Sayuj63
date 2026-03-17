import { admin } from "@/lib/firebaseAdmin";

export interface Transaction {
    id?: string;
    userId: string;
    itemId: string;
    itemType: "course" | "event" | "resource";
    amount: number;
    paymentStatus: "pending" | "success" | "failed";
    paymentGateway: "razorpay" | "stripe";
    createdAt: admin.firestore.Timestamp | Date;
}
