import { NextRequest, NextResponse } from "next/server";
import { RevisionService } from "@/services/revisionService";
import { verifyAdmin } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
    try {
        await verifyAdmin(req);
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const history = await RevisionService.getHistory(id);
        return NextResponse.json(history);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
