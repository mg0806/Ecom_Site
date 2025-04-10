import { NextResponse } from "next/server";

export async function GET() {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    try {
        const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to authenticate");

        return NextResponse.json({ token: data.token });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
