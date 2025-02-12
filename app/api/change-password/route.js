import { NextResponse } from "next/server";
import { connectToDB } from "../../db/connection";
import { User } from "../../db/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    // Authorization check
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Token verification
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { status: "error", message: "Invalid token" },
        { status: 403 }
      );
    }

    // Request body validation
    const body = await req.json();
    const { current_password, new_password } = body;

    if (!current_password?.trim() || !new_password?.trim()) {
      return NextResponse.json(
        {
          status: "error",
          message: "Both current and new passwords are required",
        },
        { status: 400 }
      );
    }

    if (current_password === new_password) {
      return NextResponse.json(
        {
          status: "error",
          message: "New password must be different from current password",
        },
        { status: 400 }
      );
    }

    // Database operations
    await connectToDB();

    const user = await User.findById(decoded.id).select("+password");
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { status: "error", message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Password update
    const saltRounds = 10;
    user.password = await bcrypt.hash(new_password, saltRounds);
    await user.save();

    return NextResponse.json(
      { status: "success", message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "An error occurred. Please try again",
      },
      { status: 500 }
    );
  }
}
