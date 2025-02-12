import { connectToDB } from "@/app/db/connection";
import { User } from "@/app/db/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");

    // Check if authorization header is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, ACCESS_KEY);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 403 }
      );
    }

    await connectToDB();
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Get updated details from request body
    const body = await req.json();
    const { profile_image, bio, other_details } = body;

    // Update user details
    if (profile_image) user.profile_image = profile_image;
    if (bio) user.bio = bio;
    if (other_details) Object.assign(user, other_details);

    await user.save();

    return NextResponse.json(
      { status: "success", message: "Profile updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
