import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyAdmin } from "@/lib/auth-server";

/**
 * MEDIA UPLOAD API
 * Handles file uploads to Cloudinary and returns the secure URL.
 * Requires Admin authentication.
 */

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Admin Auth
        console.log("[Media Upload] Verifying admin status...");
        const decodedToken = await verifyAdmin(req);
        console.log(`[Media Upload] User verified: ${decodedToken.email} (${decodedToken.uid})`);

        // 2. Parse Form Data
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "mentorleap/general";

        let resourceType = (formData.get("resource_type") as string) || "auto";

        if (!file) {
            console.error("[Media Upload] No file provided in form data");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Auto-detect resource type for PDFs and other files if set to 'auto'
        if (resourceType === "auto") {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith(".pdf") || fileName.endsWith(".docx") || fileName.endsWith(".xlsx") || fileName.endsWith(".zip")) {
                resourceType = "raw";
            } else if (fileName.endsWith(".mp4") || fileName.endsWith(".mov") || fileName.endsWith(".avi")) {
                resourceType = "video";
            }
        }

        console.log(`[Media Upload] File received: ${file.name} (${file.type}, ${file.size} bytes)`);

        // 3. Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 4. Upload to Cloudinary
        console.log(`[Media Upload] Starting Cloudinary upload to folder: ${folder} with resource_type: ${resourceType}`);

        return new Promise<NextResponse>((resolve) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: resourceType as any,
                },
                (error, result) => {
                    if (error) {
                        console.error("[Media Upload] Cloudinary Stream Error:", error);
                        resolve(NextResponse.json({
                            error: `Cloudinary error: ${error.message}`,
                            details: error
                        }, { status: 500 }));
                    } else {
                        console.log("[Media Upload] Upload successful! URL:", result?.secure_url);
                        resolve(NextResponse.json({
                            url: result?.secure_url,
                            public_id: result?.public_id,
                            format: result?.format,
                            bytes: result?.bytes,
                            resource_type: result?.resource_type
                        }));
                    }
                }
            );

            uploadStream.end(buffer);
        });

    } catch (error: any) {
        console.error("[Media Upload] API Route Error:", error);
        const status = error.message.includes("Forbidden") ? 403 : 500;
        return NextResponse.json({
            error: error.message || "Internal server error during upload"
        }, { status });
    }
}
