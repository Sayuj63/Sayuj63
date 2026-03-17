import { admin } from "@/lib/firebaseAdmin";

export type ResourceCategory =
    | "Recorded Courses"
    | "Public Speaking"
    | "Leadership Communication"
    | "PDF Templates"
    | "Audio Bundles";

export interface Resource {
    id?: string;
    title: string;
    category: ResourceCategory;
    fileUrl: string; // Cloudinary URL
    createdAt: admin.firestore.Timestamp | Date;
}
