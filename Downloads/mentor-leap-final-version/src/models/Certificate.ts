import { admin } from "@/lib/firebaseAdmin";

export interface Certificate {
    id?: string;
    userId: string;
    courseId: string;
    certificateUrl: string; // Cloudinary URL
    issuedAt: admin.firestore.Timestamp | Date;
}
