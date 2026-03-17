// Test script to check Firestore counts
import { db } from "../lib/firebaseAdmin";

async function run() {
    try {
        const courses = await db.collection("courses").get();
        console.log(`Total courses in DB: ${courses.size}`);

        const publishedCourses = courses.docs.filter((d: any) => d.data().status === 'published');
        console.log(`Published courses: ${publishedCourses.length}`);

        courses.docs.slice(0, 5).forEach((d: any) => {
            console.log(`Course: ${d.id} | Status: ${d.data().status} | Price: ${d.data().price}`);
        });
    } catch (e) {
        console.error(e);
    }
}

run();
