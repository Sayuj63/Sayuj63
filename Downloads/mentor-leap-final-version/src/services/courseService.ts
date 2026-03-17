import { db, admin } from "@/lib/firebaseAdmin";
import { Course, Module, Lesson } from "@/models/Course";

export const CourseService = {
    async createCourse(data: Omit<Course, "id" | "createdAt" | "updatedAt">) {
        const courseRef = db.collection("courses").doc();
        const now = admin.firestore.FieldValue.serverTimestamp();
        const courseData = {
            ...data,
            id: courseRef.id,
            createdAt: now,
            updatedAt: now,
        };
        await courseRef.set(courseData);
        return courseData;
    },

    async updateCourse(courseId: string, data: Partial<Course>) {
        await db.collection("courses").doc(courseId).update({
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    },

    async deleteCourse(courseId: string) {
        await db.collection("courses").doc(courseId).delete();
    },

    async getCourse(courseId: string) {
        const doc = await db.collection("courses").doc(courseId).get();
        return doc.exists ? ({ id: doc.id, ...doc.data() } as Course) : null;
    },

    async getAllCourses() {
        const snapshot = await db.collection("courses").get();
        const courses = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as Course);

        // In-memory sort to prevent dropping courses without a createdAt field
        return courses.sort((a: any, b: any) => {
            const timeA = a.createdAt?._seconds || a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?._seconds || b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
        });
    },

    async addModule(courseId: string, module: Module) {
        await db.collection("courses").doc(courseId).update({
            modules: admin.firestore.FieldValue.arrayUnion(module),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    },

    async addLesson(courseId: string, moduleId: string, lesson: Lesson) {
        // Warning: This still requires a fetch to update the correct module within the array.
        // For production, consider moving modules to a sub-collection if lessons are added frequently.
        const course = await this.getCourse(courseId);
        if (!course) throw new Error("Course not found");

        const updatedModules = course.modules.map((mod: Module) => {
            if (mod.id === moduleId) {
                return { ...mod, lessons: [...mod.lessons, lesson] };
            }
            return mod;
        });

        await db.collection("courses").doc(courseId).update({ 
            modules: updatedModules,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    },
};
