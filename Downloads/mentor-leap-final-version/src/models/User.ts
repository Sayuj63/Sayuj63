import { admin } from "@/lib/firebaseAdmin";

export interface User {
    uid: string;
    name: string;
    email: string;
    role: "student" | "admin";
    enrolledCourses: string[]; // Array of course IDs
    registeredEvents: string[]; // Array of event IDs
    certificates: string[]; // Array of certificate IDs
    profileCompleted?: boolean;
    dateOfBirth?: string;
    gender?: string;
    contactNumber?: string;
    address?: string;
    interests?: string[];
    aboutMe?: string;
    photoURL?: string;
    createdAt: admin.firestore.Timestamp | Date;
}
