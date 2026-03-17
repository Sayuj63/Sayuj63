import { Timestamp } from 'firebase/firestore';

export interface User {
    id?: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    enrolledCourses: string[];
    registeredEvents: string[];
    certificates: string[];
    createdAt: Timestamp;
}

export interface Course {
    id?: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    price: number;
    category: string;
    createdAt: Timestamp;
}

export interface CourseModule {
    id?: string;
    title: string;
    order: number;
}

export interface CourseLesson {
    id?: string;
    title: string;
    videoUrl: string;
    duration: number; // in minutes
    order: number;
}

export interface Event {
    id?: string;
    title: string;
    type: 'bootcamp' | 'masterclass' | 'webinar';
    date: Timestamp;
    price: number;
    banner: string;
    googleMeetLink?: string;
    attendees: string[];
    createdAt: Timestamp;
}

export interface Resource {
    id?: string;
    title: string;
    category: 'Recorded Courses' | 'Public Speaking' | 'Leadership Communication' | 'PDF Templates' | 'Audio Bundles';
    fileUrl: string;
    createdAt: Timestamp;
}

export interface Certificate {
    id?: string;
    userId: string;
    courseId: string;
    certificateUrl: string;
    issuedAt: Timestamp;
}

export interface Transaction {
    id?: string;
    userId: string;
    amount: number;
    itemType: 'course' | 'event';
    itemId: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Timestamp;
}

export interface Blog {
    id?: string;
    title: string;
    content: string; // Markdown or HTML
    author: string;
    thumbnail: string;
    createdAt: Timestamp;
}
