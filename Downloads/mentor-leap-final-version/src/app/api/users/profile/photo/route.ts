import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyUser } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
    try {
        console.log("[Profile Photo Upload] Verifying user...");
        const decodedToken = await verifyUser(req);

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`[Profile Photo Upload] User ${decodedToken.uid} uploading ${file.name}`);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise<NextResponse>((resolve) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `mentorleap/profiles/${decodedToken.uid}`,
                    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
                },
                (error, result) => {
                    if (error) {
                        console.error("[Profile Photo Upload] Cloudinary Stream Error:", error);
                        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
                    } else {
                        console.log("[Profile Photo Upload] Upload successful! URL:", result?.secure_url);
                        resolve(NextResponse.json({ url: result?.secure_url }));
                    }
                }
            );
            uploadStream.end(buffer);
        });
    } catch (error: any) {
        console.error("[Profile Photo Upload] Error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
