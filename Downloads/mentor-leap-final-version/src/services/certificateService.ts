import { db, admin } from "@/lib/firebaseAdmin";
import { Certificate } from "@/models/Certificate";

export const CertificateService = {
    async issueCertificate(data: Omit<Certificate, "id" | "issuedAt">) {
        const certRef = db.collection("certificates").doc();
        const certData = {
            ...data,
            id: certRef.id,
            issuedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await certRef.set(certData);

        // Also update user's certificate list
        await db.collection("users").doc(data.userId).update({
            certificates: admin.firestore.FieldValue.arrayUnion(certRef.id),
        });

        return certData;
    },

    async getUserCertificates(uid: string) {
        const snapshot = await db
            .collection("certificates")
            .where("userId", "==", uid)
            .orderBy("issuedAt", "desc")
            .get();
        return snapshot.docs.map((doc: any) => doc.data() as Certificate);
    },
};
