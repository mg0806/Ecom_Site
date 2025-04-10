import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb"
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        let currentUser;
        try {
            currentUser = await getCurrentUser();
            if (!currentUser) {
                // console.log("❌ Unauthorized request: No user found.");
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        } catch (err) {
            console.error("❌ Error fetching user:", err);
            return NextResponse.json({ error: "User authentication failed" }, { status: 500 });
        }
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, payment_intent_id, order_amount } = body;
        // console.log("payment intent id:", body.payment_intent_id)
        const total = order_amount * 100;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const secret = process.env.RAZORPAY_SECRET;
        if (!secret) {
            return NextResponse.json(
                { success: false, error: "Server error: Missing Razorpay Secret" },
                { status: 500 }
            );
        }

        // Generate expected signature
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // console.log("🔹 Expected Signature:", expectedSignature);
        // console.log("🔹 Received Signature:", razorpay_signature);

        // Verify if the received signature matches the expected one
        if (expectedSignature === razorpay_signature) {
            // Signature matches, update the order status in the database
            // console.log("Payment Successful")
            // await prisma?.order.update({
            //     where: { paymentIntentId: razorpay_order_id },
            //     data: {
            //         status: "complete",
            //         createdDate: new Date(), // <-- manually setting the timestamp to current
            //     }
            // })
            // creating order after successful payemnt
            try {
                // console.log("📦 Storing order in Prisma DB...");
                await prisma.order.create({
                    data: {
                        userId: currentUser.id,
                        amount: total,
                        currency: "INR",
                        status: "complete",
                        deliveryStatus: "pending",
                        paymentIntentId: payment_intent_id, // ✅ Use Razorpay Order ID
                        products: items as Prisma.JsonArray,
                    },
                });
                // console.log("✅ Order successfully stored in database.");
            } catch (prismaError) {
                console.error("❌ Prisma Order Creation Failed:", prismaError);
                return NextResponse.json(
                    { error: "Database error", details: (prismaError as any).message },
                    { status: 500 }
                );
            }

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { success: false, error: "Invalid payment signature" },
                { status: 400 }
            );
        }
    } catch (error) {
        // console.error("❌ Error in payment verification:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
