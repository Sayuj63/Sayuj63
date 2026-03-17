import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/services/categoryService";
import { verifyAdmin } from "@/lib/auth-server";

export async function PATCH(req: NextRequest, { params }: any) {
    try {
        await verifyAdmin(req);
        const { id } = params;
        const data = await req.json();
        await CategoryService.updateCategory(id, data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: any) {
    try {
        await verifyAdmin(req);
        const { id } = params;
        await CategoryService.deleteCategory(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
