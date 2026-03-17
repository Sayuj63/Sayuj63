import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-server";
import { db, admin } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await verifyAdmin(req);

        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") || "all"; // "day" | "month" | "year" | "all"

        let query = db.collection("transactions").where("paymentStatus", "==", "success");

        const now = new Date();
        let startDate: Date | null = null;

        if (range === "day") {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (range === "month") {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (range === "year") {
            startDate = new Date(now.getFullYear(), 0, 1);
        }

        if (startDate) {
            query = query.where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate)) as any;
        }

        const transactionsSnap = await query.orderBy("createdAt", "desc").get();

        let totalRevenue = 0;
        const transactions: any[] = [];
        const revenueByDay: Record<string, number> = {};

        transactionsSnap.forEach((doc: any) => {
            const data = doc.data();
            const amount = data.amount || 0;
            totalRevenue += amount;

            // Build daily breakdown for chart
            const date = data.createdAt?._seconds
                ? new Date(data.createdAt._seconds * 1000)
                : new Date(data.createdAt);
            const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            revenueByDay[dayKey] = (revenueByDay[dayKey] || 0) + amount;

            transactions.push({
                id: doc.id,
                userId: data.userId,
                itemId: data.itemId,
                itemType: data.itemType,
                amount,
                paymentStatus: data.paymentStatus,
                paymentGateway: data.paymentGateway,
                createdAt: data.createdAt?._seconds
                    ? new Date(data.createdAt._seconds * 1000).toISOString()
                    : null,
            });
        });

        // This month's revenue
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        let monthRevenue = 0;
        transactions.forEach((t) => {
            if (t.createdAt && new Date(t.createdAt) >= monthStart) {
                monthRevenue += t.amount;
            }
        });

        // Build course-based revenue: price * enrollments
        const coursesSnap = await db.collection("courses").get();
        let courseRevenueTotal = 0;
        const courseSummary: any[] = [];
        for (const courseDoc of coursesSnap.docs) {
            const courseData = courseDoc.data();
            // Count users enrolled in this course
            const enrolledSnap = await db
                .collection("users")
                .where("enrolledCourses", "array-contains", courseDoc.id)
                .count()
                .get();
            const enrollmentCount = enrolledSnap.data().count;
            const courseRevenue = (courseData.price || 0) * enrollmentCount;
            courseRevenueTotal += courseRevenue;
            if (enrollmentCount > 0) {
                courseSummary.push({
                    id: courseDoc.id,
                    title: courseData.title,
                    price: courseData.price || 0,
                    enrollments: enrollmentCount,
                    revenue: courseRevenue,
                });
            }
        }
        // Sort by revenue descending
        courseSummary.sort((a, b) => b.revenue - a.revenue);

        return NextResponse.json({
            totalRevenue,
            monthRevenue,
            courseRevenueTotal,
            transactionCount: transactions.length,
            revenueByDay,
            courseSummary: courseSummary.slice(0, 10),
            recentTransactions: transactions.slice(0, 20),
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message.includes("Forbidden") ? 403 : 500 }
        );
    }
}
