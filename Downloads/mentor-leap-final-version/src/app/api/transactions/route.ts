import { NextRequest, NextResponse } from "next/server";
import { TransactionService } from "@/services/transactionService";
import { verifyAdmin, verifyUser } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
    try {
        const decodedToken = await verifyUser(req);
        const data = await req.json();
        
        // Security: Ensure the transaction is created for the authenticated user
        if (data.userId !== decodedToken.uid) {
            return NextResponse.json({ error: "Forbidden: Cannot create transaction for another user" }, { status: 403 });
        }

        const transaction = await TransactionService.createTransaction(data);
        return NextResponse.json(transaction);
    } catch (error: any) {
        const status = error.message.includes("Unauthorized") ? 401 : error.message.includes("Forbidden") ? 403 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await verifyAdmin(req);
        const { transactionId, status } = await req.json();
        await TransactionService.updateTransactionStatus(transactionId, status);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        const status = error.message.includes("Unauthorized") ? 401 : error.message.includes("Forbidden") ? 403 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

        // Security: Users can only see their own transactions; admins can see any
        await verifyUser(req, userId);

        const transactions = await TransactionService.getUserTransactions(userId);
        return NextResponse.json(transactions);
    } catch (error: any) {
        const status = error.message.includes("Unauthorized") ? 401 : error.message.includes("Forbidden") ? 403 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}
