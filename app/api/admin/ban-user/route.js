import { connectToDB } from "@/app/db/connection";
import { Admin } from "@/app/db/models/Admin";
import { User } from "@/app/db/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    //   verify token
    let decoded = jwt.verify(token, ACCESS_KEY);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 403 }
      );
    }

    await connectToDB();

    //   check if user if admin
    const admin = await User.findById(decoded.user_id);
    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { error: "Only admins can perform this action." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    user.banned = true;
    await user.save();

    // store admin action in db
    await Admin.create({
      admin_id: admin._id,
      action: "ban_user",
      target_user_id: user_id,
    });

    return NextResponse.json(
      { status: "success", message: "User has been banned successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ban user error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
