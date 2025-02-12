import { NextResponse } from "next/server";
import { connectToDB } from "../../db/connection";
import { User } from "../../db/models/User";
import jwt from "jsonwebtoken";
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
    const user = await User.findOne({
      $or: [{ email: email_or_phone }, { phone: email_or_phone }],
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found." },
        { status: 404 }
      );
    }

    // Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("Missing JWT_SECRET in environment variables.");
    }

    // Generate JWT reset token (expires in 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Ensure email environment variables exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email credentials in environment variables.");
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        status: "success",
        message: "Password reset link sent to your email.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error handling password recovery:", err);
    return NextResponse.json(
      { status: "error", message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
