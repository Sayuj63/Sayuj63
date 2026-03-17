import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@/services/eventService";
import { auth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const idToken = req.headers.get("Authorization")?.split("Bearer ")[1];
        if (!idToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const { eventId } = await req.json();
        if (!eventId) return NextResponse.json({ error: "Event ID is required" }, { status: 400 });

        await EventService.registerForEvent(eventId, uid);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
