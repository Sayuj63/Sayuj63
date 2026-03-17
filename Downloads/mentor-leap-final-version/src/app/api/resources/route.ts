import { NextRequest, NextResponse } from "next/server";
import { ResourceService } from "@/services/resourceService";
import { verifyAdmin } from "@/lib/auth-server";
import { LoggerService } from "@/services/loggerService";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const resources = category
            ? await ResourceService.getResourcesByCategory(category as any)
            : await ResourceService.getResources();

        return NextResponse.json(resources);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const decodedToken = await verifyAdmin(req);
        const data = await req.json();
        const resource = await ResourceService.uploadResource(data);

        await LoggerService.logAdminAction(decodedToken.uid, "UPLOAD_RESOURCE", { title: data.title, category: data.category });

        return NextResponse.json(resource);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const decodedToken = await verifyAdmin(req);
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await ResourceService.deleteResource(id);

        await LoggerService.logAdminAction(decodedToken.uid, "DELETE_RESOURCE", { resourceId: id });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
