import { connectToDB } from "@/app/db/connection";
import { Crime } from "@/app/db/models/Crime";
import { User } from "@/app/db/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;

export async function GET(req, { params }) {
  

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    // Verify token
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

    const { id } =await params;

   
    const crime = await Crime.findById(id)
      .populate("user_id", "email phone profile_image") 
      // .populate("comments"); 

    // Check if crime exists
    if (!crime) {
      return NextResponse.json(
        { error: "Crime report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        crime_id: crime._id,
        title: crime.title,
        description: crime.description,
        division: crime.division,
        district: crime.district,
        image: crime.image,
        video: crime.video,
        post_time: crime.post_time,
        crime_time: crime.crime_time,
        user_id: crime.user_id, 
        upvotes: crime.upvotes,
        downvotes: crime.downvotes,
        verification_score: crime.verification_score,
        comments: crime.comments, 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching crime report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
