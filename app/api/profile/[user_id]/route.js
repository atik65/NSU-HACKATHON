import { connectToDB } from "@/app/db/connection";
import { User } from "@/app/db/models/User";
import { Crime } from "@/app/db/models/Crime";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const { user_id } =await params;

    // Find user by ID and populate crime reports
    const user = await User.findById(user_id)
      .populate({
        path: "crime_reports",
        model: Crime, 
        select: "title description division district post_time crime_time", 
      });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        user_id: user._id,
        email: user.email,
        phone_number: user.phone,
        verified: user.verified,
        banned: user.banned,
        profile_image: user.profile_image,
        bio: user.bio,
        crime_reports: user.crime_reports,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
