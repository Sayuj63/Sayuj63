import { NextRequest, NextResponse } from "next/server";
import { CertificateService } from "@/services/certificateService";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const certificate = await CertificateService.issueCertificate(data);
        return NextResponse.json(certificate);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

        const certificates = await CertificateService.getUserCertificates(userId);
        return NextResponse.json(certificates);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
