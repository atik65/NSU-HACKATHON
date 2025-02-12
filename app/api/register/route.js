import { NextResponse } from "next/server";
import { connectToDB } from "../../db/connection";
import { User } from "../../db/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, phone, password } = body;

    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required.", status: "failed" },
        { status: 400, statusText: "Bad Request" }
      );
    }

    await connectToDB();

    // Check if user with email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            existingUser.email === email
              ? "Email already in use."
              : "Phone number already in use.",
          status: "failed",
        },
        { status: 409, statusText: "Conflict" }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user_id: newUser._id,
        status: "success",
      },
      { status: 201, statusText: "Created" }
    );
  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error. Please try again later.",
        status: "failed",
      },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
