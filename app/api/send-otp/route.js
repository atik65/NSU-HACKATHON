import { NextResponse } from "next/server";
import { connectToDB } from "../../db/connection";
import { User } from "../../db/models/User";
import { OTP } from "../../db/models/OTP";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email_or_phone } = body;

    if (!email_or_phone) {
      return NextResponse.json(
        { status: "error", message: "Email or phone number is required." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();

    // Find user by email or phone
    let user = await User.findOne({
      $or: [{ email: email_or_phone }, { phone: email_or_phone }],
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found." },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save OTP to OTP collection
    await OTP.create({
      email_or_phone,
      otp: otp,
      expires_at: otpExpires,
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email credentials in environment variables.");
    }

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        status: "success",
        message: "OTP sent successfully.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error sending OTP:", err);
    return NextResponse.json(
      { status: "error", message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
