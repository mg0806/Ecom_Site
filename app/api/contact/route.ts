import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        // Email Transporter Setup
        const transporter = nodemailer.createTransport({
            service: "gmail", // You can also use "hotmail", "yahoo", etc.
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email app password
            },
        });

        // Email Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "manohargupta0806@gmail.com", // Change this to your email
            subject: `User Complain From mandla store ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email sent successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
    }
}
