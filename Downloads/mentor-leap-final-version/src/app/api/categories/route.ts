import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/services/categoryService";
import { verifyAdmin } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
    try {
        const categories = await CategoryService.getAllCategories();
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await verifyAdmin(req);
        const data = await req.json();
        const category = await CategoryService.createCategory(data);
        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
