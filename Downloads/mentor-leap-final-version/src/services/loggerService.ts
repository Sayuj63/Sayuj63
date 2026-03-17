import { db, admin } from "@/lib/firebaseAdmin";

export const LoggerService = {
    async logAdminAction(adminUid: string, action: string, details: any) {
        try {
            const logRef = db.collection("admin_logs").doc();
            await logRef.set({
                adminUid,
                action,
                details,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            console.error("Failed to log admin action:", error);
        }
    }
};
