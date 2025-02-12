import { connectToDB } from "@/app/db/connection";
import { OTP } from "@/app/db/models/OTP";
import { User } from "@/app/db/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { otp, email_or_phone } = body;

    if (!otp || !email_or_phone) {
      return NextResponse.json(
        { status: "error", message: "OTP and phone number are required." },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the OTP entry for the phone number
    const otpEntry = await OTP.findOne({ email_or_phone, otp });

    if (!otpEntry) {
      return NextResponse.json(
        { status: "error", message: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    // Update the user's verified status
    await User.findOneAndUpdate({ email: email_or_phone }, { verified: true });

    return NextResponse.json(
      {
        status: "success",
        message: "OTP verified successfully! User verified.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error." },
      { status: 500 }
    );
  }
}
