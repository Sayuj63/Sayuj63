import { auth, db } from "./firebaseAdmin";
import { NextRequest } from "next/server";

export async function verifyAdmin(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Unauthorized: No token provided");
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);

        // 1. Check custom claims
        if (decodedToken.role === "admin") return decodedToken;

        // 2. Fallback: Check hardcoded super-admin email
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@mentorleap.com";
        if (decodedToken.email?.toLowerCase() === adminEmail.toLowerCase()) {
            // Upgrade them to admin role in custom claims for future requests
            await auth.setCustomUserClaims(decodedToken.uid, { role: "admin" });
            return decodedToken;
        }

        // 3. Fallback: Check Firestore role
        const userDoc = await db.collection("users").doc(decodedToken.uid).get();
        const userData = userDoc.data();

        if (userData?.role === "admin") {
            // Also upgrade custom claims
            await auth.setCustomUserClaims(decodedToken.uid, { role: "admin" });
            return decodedToken;
        }

        console.error(`Admin Access Denied for: ${decodedToken.email} (${decodedToken.uid})`);
        throw new Error(`Forbidden: Admin access required. Current user: ${decodedToken.email || 'No Email'}`);
    } catch (error: any) {
        console.error("Auth Verification Error:", error.message);
        throw new Error(error.message || "Unauthorized access");
    }
}

export async function verifyUser(req: NextRequest, targetUid?: string) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Unauthorized: No token provided");
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(idToken);

    if (targetUid && decodedToken.uid !== targetUid && decodedToken.role !== "admin") {
        throw new Error("Forbidden: You can only access your own data");
    }

    return decodedToken;
}
