import { NextRequest, NextResponse } from "next/server";
import { CourseService } from "@/services/courseService";
import { verifyAdmin } from "@/lib/auth-server";

export async function GET(req: NextRequest, { params }: any) {
    try {
        const { id } = params;
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const course = await CourseService.getCourse(id);
        if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

        return NextResponse.json(course);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: any) {
    try {
        await verifyAdmin(req);
        const { id } = params;
        await CourseService.deleteCourse(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: any) {
    try {
        const decodedToken = await verifyAdmin(req);
        const { id } = params;
        const newData = await req.json();

        // Log Revision
        const { RevisionService } = await import("@/services/revisionService");
        const oldData = await CourseService.getCourse(id);
        if (oldData) {
            await RevisionService.logRevision("course", id, oldData, newData, (decodedToken as any).uid);
        }

        await CourseService.updateCourse(id, newData);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
