import { NextRequest, NextResponse } from "next/server";
import { db, admin } from "@/lib/firebaseAdmin";
import { verifyUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const decodedToken = await verifyUser(req);
        const uid = decodedToken.uid;

        const body = await req.json();
        let courseIds: string[] = [];

        // Support both single and multiple course enrollments
        if (body.courseIds && Array.isArray(body.courseIds)) {
            courseIds = body.courseIds;
        } else if (body.courseId) {
            courseIds = [body.courseId];
        }

        if (courseIds.length === 0) {
            return NextResponse.json({ error: "courseId or courseIds array is required" }, { status: 400 });
        }

        // 1. Verify all courses exist and are free
        const coursesRef = db.collection("courses");
        const validCourseIds: string[] = [];

        for (const cId of courseIds) {
            const courseDoc = await coursesRef.doc(cId).get();
            if (!courseDoc.exists) {
                return NextResponse.json({ error: `Course not found: ${cId}` }, { status: 404 });
            }

            const courseData = courseDoc.data() || {};
            const price = courseData.price || 0;

            if (price > 0) {
                return NextResponse.json({ error: `Course requires payment: ${cId}` }, { status: 403 });
            }

            validCourseIds.push(cId);
        }

        // 2. Add to user's enrolledCourses
        const userRef = db.collection("users").doc(uid);

        // arrayUnion takes multiple arguments
        await userRef.update({
            enrolledCourses: admin.firestore.FieldValue.arrayUnion(...validCourseIds)
        });

        // 3. Create transaction records for "free" enrollments
        const batch = db.batch();
        const transactionsRef = db.collection("transactions");

        for (const cId of validCourseIds) {
            const newTxRef = transactionsRef.doc();
            batch.set(newTxRef, {
                userId: uid,
                itemId: cId,
                itemType: "course",
                amount: 0,
                paymentStatus: "success",
                paymentGateway: "free",
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        await batch.commit();

        return NextResponse.json({ success: true, message: "Enrolled successfully in " + validCourseIds.length + " course(s)" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
