import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
    try {
        const decodedToken = await verifyUser(req);
        const uid = decodedToken.uid;
        const data = await req.json();

        // Ensure we only update allowable fields to prevent privilege escalation (e.g., changing role)
        const updateData: any = {};
        const safeFields = [
            "name", "dateOfBirth", "gender", "contactNumber",
            "address", "interests", "aboutMe", "photoURL", "profileCompleted"
        ];

        safeFields.forEach(field => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        const userRef = db.collection("users").doc(uid);
        await userRef.update(updateData);

        return NextResponse.json({ success: true, message: "Profile updated successfully" });
    } catch (error: any) {
        console.error("Profile API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
