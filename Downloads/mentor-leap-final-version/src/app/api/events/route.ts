import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@/services/eventService";
import { verifyAdmin } from "@/lib/auth-server";
import { LoggerService } from "@/services/loggerService";

export async function GET() {
    try {
        const events = await EventService.getEvents();
        return NextResponse.json(events);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const decodedToken = await verifyAdmin(req);
        const data = await req.json();
        const event = await EventService.createEvent(data);

        await LoggerService.logAdminAction(decodedToken.uid, "CREATE_EVENT", { title: data.title });

        return NextResponse.json(event);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
