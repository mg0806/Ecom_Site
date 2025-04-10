import Razorpay from "razorpay";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Prisma } from "@prisma/client";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_SECRET as string,
});

// Debugging environment variables
// console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID || "❌ NOT SET");
// console.log("RAZORPAY_SECRET:", process.env.RAZORPAY_SECRET ? "✅ SET" : "❌ NOT SET");

// Function to calculate total order amount
// const calculateOrderAmount = (items: CartProductType[]) => {
//     return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
// };

export async function POST(request: Request) {
    try {
        // console.log("📌 Inside the POST function API call...");

        // Get the current user
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

        // Parse request body
        let body;
        try {
            body = await request.json();
        } catch (err) {
            console.error("❌ Error parsing request body:", err);
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { items, payment_intent_id, order_amount } = body;
        // console.log(items, payment_intent_id, order_amount);
        if (!items || items.length === 0) {
            // console.log("❌ Empty cart received.");
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const total = order_amount * 100;
        let razorpayOrderId = payment_intent_id;

        // Create a new Razorpay order if no existing one
        if (!razorpayOrderId) {
            try {
                // console.log("🛒 Creating new Razorpay order...");
                const razorpayOrder = await razorpay.orders.create({
                    amount: total,
                    currency: "INR",
                    receipt: `order_rcptid_${Date.now()}`,
                });
                razorpayOrderId = razorpayOrder.id;
                // console.log("✅ Razorpay Order Created:", razorpayOrder);
            } catch (error: any) {
                console.error("❌ Razorpay Order Creation Failed:", error);
                return NextResponse.json(
                    { error: "Razorpay API error", details: error.message },
                    { status: 500 }
                );
            }

            // Store order in Prisma database
            // try {
            //     // console.log("📦 Storing order in Prisma DB...");
            //     await prisma.order.create({
            //         data: {
            //             userId: currentUser.id,
            //             amount: total,
            //             currency: "INR",
            //             status: "pending",
            //             deliveryStatus: "pending",
            //             paymentIntentId: razorpayOrderId, // ✅ Use Razorpay Order ID
            //             products: items as Prisma.JsonArray,
            //         },
            //     });
            //     // console.log("✅ Order successfully stored in database.");
            // } catch (prismaError) {
            //     console.error("❌ Prisma Order Creation Failed:", prismaError);
            //     return NextResponse.json(
            //         { error: "Database error", details: (prismaError as any).message },
            //         { status: 500 }
            //     );
            // }
        }

        // console.log("🎉 Order Processed Successfully:", {
        //     orderId: razorpayOrderId,
        //     paymentIntentId: razorpayOrderId,
        // });

        return NextResponse.json({
            orderId: razorpayOrderId,
            paymentIntentId: razorpayOrderId,
        });

    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: (error as any).message },
            { status: 500 }
        );
    }
}
