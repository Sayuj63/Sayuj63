import { NextRequest, NextResponse } from "next/server";
import { CourseService } from "@/services/courseService";
import { verifyAdmin } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const courses = await CourseService.getAllCourses();
        return NextResponse.json(courses);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await verifyAdmin(req);
        const data = await req.json();
        const course = await CourseService.createCourse(data);
        return NextResponse.json(course);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
