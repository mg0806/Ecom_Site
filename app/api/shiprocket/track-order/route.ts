import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb"; // adjust path as per your project

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL!;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD!;

let token: string | null = null;
let tokenExpiry = 0;

export async function GET(req: NextRequest) {
    const awb = req.nextUrl.searchParams.get("awb");

    if (!awb) {
        return NextResponse.json({ error: "AWB number is required" }, { status: 400 });
    }

    const now = Date.now();

    if (!token || now > tokenExpiry) {
        try {
            const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }),
            });

            const data = await res.json();

            if (!res.ok || !data.token) {
                return NextResponse.json({ error: "Authentication failed", details: data?.message }, { status: 401 });
            }

            token = data.token;
            tokenExpiry = now + 60 * 60 * 1000;
        } catch (err: any) {
            return NextResponse.json({ error: "Token request failed", details: err.message }, { status: 500 });
        }
    }

    try {
        const trackingRes = await fetch(
            `https://apiv2.shiprocket.in/v1/external/courier/track?awb=${awb}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const trackingData = await trackingRes.json();

        if (!trackingRes.ok) {
            return NextResponse.json({ error: "Failed to get tracking info", details: trackingData }, { status: 500 });
        }

        // ✅ Extract latest status
        const deliveryStatus = trackingData?.tracking_data?.shipment_track?.current_status || "Unknown";

        // ✅ Update the order in your DB by AWB
        await prisma.order.updateMany({
            where: { awb: awb },
            data: { deliveryStatus },
        });

        return NextResponse.json(trackingData);
    } catch (err: any) {
        return NextResponse.json({ error: "Tracking failed", details: err.message }, { status: 500 });
    }
}
