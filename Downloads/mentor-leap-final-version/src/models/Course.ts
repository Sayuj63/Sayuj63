import { admin } from "@/lib/firebaseAdmin";

export interface Lesson {
    id: string;
    title: string;
    videoUrl: string; // Cloudinary URL
    duration: number; // in minutes
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id?: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string; // Cloudinary URL
    price: number;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    duration: string;
    status: "draft" | "published" | "archived";
    modules: Module[];
    createdAt: admin.firestore.Timestamp | Date;
    updatedAt?: admin.firestore.Timestamp | Date;
}
