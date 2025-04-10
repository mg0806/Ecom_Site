// /app/api/shiprocket/create-order/route.ts

import { NextRequest, NextResponse } from "next/server";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL!;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            razorpay_payment_id,
            order_id,
            products,
            user,
            amount,
            currency,
            shipping,
        } = body;

        // console.log("📦 Received data:", {
        //     razorpay_payment_id,
        //     order_id,
        //     products,
        //     user,
        //     amount,
        //     currency,
        //     shipping,
        // });

        // 🔐 1. Authenticate with Shiprocket
        const authResponse = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: SHIPROCKET_EMAIL,
                password: SHIPROCKET_PASSWORD,
            }),
        });

        const authData = await authResponse.json();
        if (!authData.token) {
            return NextResponse.json({ error: "Shiprocket auth failed" }, { status: 500 });
        }

        const token = authData.token;

        // 🛒 2. Prepare Order Payload
        const orderItems = products.map((item: any) => ({
            name: item.name,
            sku: item.id,
            units: item.quantity,
            selling_price: item.price,
        }));

        const isTestMode = true;

        const orderPayload = isTestMode
            ? {
                order_id,
                order_date: new Date().toISOString().split("T")[0],
                pickup_location: "test",
                billing_customer_name: "Test",
                billing_last_name: "User",
                billing_address: "Test Address",
                billing_city: "Test City",
                billing_pincode: "391740",
                billing_state: "Gujarat",
                billing_country: "India",
                billing_email: "test@example.com",
                billing_phone: "1234567890",
                shipping_is_billing: true,
                order_items: [
                    {
                        name: "Test Item",
                        sku: "SKU123TEST",
                        units: 1,
                        selling_price: 100,
                    },
                ],
                payment_method: "prepaid",
                sub_total: 100,
                length: 10,
                breadth: 10,
                height: 10,
                weight: 0.2,
            }
            : {
                order_id,
                order_date: new Date().toISOString().split("T")[0],
                pickup_location: "test",
                billing_customer_name: user?.name?.split(" ")[0] || "Customer",
                billing_last_name: user?.name?.split(" ")[1] || "",
                billing_address: user?.address || "Address",
                billing_city: shipping?.city || "City",
                billing_pincode: shipping?.pincode || "391740",
                billing_state: shipping?.state || "State",
                billing_country: shipping?.country || "India",
                billing_email: shipping?.email,
                billing_phone: shipping?.phone || "1234567890",
                shipping_is_billing: true,
                order_items: orderItems,
                payment_method: "Prepaid",
                sub_total: amount,
                length: 10,
                breadth: 10,
                height: 10,
                weight: shipping?.weight || 0.5,
            };

        // 🚚 3. Create the order
        const orderResponse = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderPayload),
        });

        const orderResult = await orderResponse.json();

        if (!orderResponse.ok || !orderResult.shipment_id) {
            return NextResponse.json(
                { error: "Failed to create Shiprocket order", details: orderResult },
                { status: 500 }
            );
        }

        const shipmentId = orderResult.shipment_id;
        // console.log("shipment Id", shipmentId);
        const pickupPincode = "391740"; // replace with your actual pickup location pincode
        const deliveryPincode = shipping.pincode;
        const cod = 0; // Prepaid
        const weight = shipping?.weight || 0.5;

        const courierListResponse = await fetch(
            `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&cod=${cod}&weight=${weight}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const courierListData = await courierListResponse.json();

        // console.log("courierListData ", courierListData);

        const cheapestCourier = courierListData.data.available_courier_companies?.sort(
            (a: any, b: any) => a.rate - b.rate
        )[0];

        if (!cheapestCourier) {
            throw new Error("No courier options found");
        }

        if (!cheapestCourier) {
            throw new Error("No couriers available");
        }

        // 🔄 4. Generate AWB (assign courier)
        const awbResponse = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                shipment_id: shipmentId,
                courier_id: cheapestCourier.courier_company_id, // ✅ assign manually
            }),
        });

        const awbData = await awbResponse.json();
        // console.log("awbData ", awbData);

        if (!awbResponse.ok || !awbData.awb_code) {
            return NextResponse.json(
                { error: "AWB generation failed", awbDetails: awbData },
                { status: 500 }
            );
        }

        // 🟢 5. Return the final result including AWB
        return NextResponse.json({
            ...orderResult,
            awb_code: awbData.awb_code,
            courier_details: awbData,
        });
    } catch (error) {
        console.error("Shiprocket Error:", error);
        return NextResponse.json({ error: "Something went wrong with Shiprocket" }, { status: 500 });
    }
}
