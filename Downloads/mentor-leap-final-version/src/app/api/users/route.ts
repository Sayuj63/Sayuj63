import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/userService";
import { verifyAdmin, verifyUser } from "@/lib/auth-server";
import { LoggerService } from "@/services/loggerService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await verifyAdmin(req);
        const users = await UserService.getAllUsers();
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { uid, ...data } = await req.json();
        if (!uid) return NextResponse.json({ error: "UID is required" }, { status: 400 });

        // Security: If a role is provided, only admins can set it.
        // If no role is provided, default to student (handled by Service).
        // If not an admin, verify the token belongs to the UID being created (self-signup).
        if (data.role && data.role !== "student") {
            await verifyAdmin(req);
        } else {
            const decodedToken = await verifyUser(req);
            if (decodedToken.uid !== uid) {
                return NextResponse.json({ error: "Forbidden: Cannot create account for another user" }, { status: 403 });
            }
        }

        const user = await UserService.createUser(uid, data);
        return NextResponse.json(user);
    } catch (error: any) {
        const status = error.message.includes("Unauthorized") ? 401 : error.message.includes("Forbidden") ? 403 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const decodedToken = await verifyAdmin(req);
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid");
        if (!uid) return NextResponse.json({ error: "UID is required" }, { status: 400 });

        await UserService.deleteUser(uid);

        await LoggerService.logAdminAction(decodedToken.uid, "DELETE_USER", { targetUid: uid });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
    }
}
