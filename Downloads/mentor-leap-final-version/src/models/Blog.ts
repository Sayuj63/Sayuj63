import { admin } from "@/lib/firebaseAdmin";

export interface Blog {
    id?: string;
    title: string;
    content: string;
    author: string;
    thumbnail: string; // Cloudinary URL
    tags: string[];
    createdAt: admin.firestore.Timestamp | Date;
}
