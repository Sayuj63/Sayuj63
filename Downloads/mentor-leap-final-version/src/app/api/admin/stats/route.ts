import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-server";
import { db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await verifyAdmin(req);

        // Run all counts in parallel
        const [usersSnap, coursesSnap, resourcesSnap, eventsSnap, transactionsSnap] = await Promise.all([
            db.collection("users").count().get(),
            db.collection("courses").count().get(),
            db.collection("resources").count().get(),
            db.collection("events").count().get(),
            // Fetch successful transactions to calculate real revenue
            db.collection("transactions").where("paymentStatus", "==", "success").get(),
        ]);

        // Calculate real revenue from successful transactions
        let totalRevenue = 0;
        transactionsSnap.forEach((doc: any) => {
            const data = doc.data();
            totalRevenue += data.amount || 0;
        });

        // Pending registrations = count of events where attendees array exists
        let pendingRegistrations = 0;
        const eventsForPending = await db.collection("events").get();
        eventsForPending.forEach((doc: any) => {
            const data = doc.data();
            pendingRegistrations += (data.attendees || []).length;
        });

        return NextResponse.json({
            users: usersSnap.data().count,
            courses: coursesSnap.data().count,
            resources: resourcesSnap.data().count,
            events: eventsSnap.data().count,
            revenue: totalRevenue,
            pendingRegistrations,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
