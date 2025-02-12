import { connectToDB } from "@/app/db/connection";
import { Crime } from "@/app/db/models/Crime";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded = jwt.verify(token, ACCESS_KEY);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 403 });
    }

    await connectToDB();

    // Extract query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 6;
    const division = url.searchParams.get("division");
    const district = url.searchParams.get("district");
    const sortBy = url.searchParams.get("sort_by") || "post_time"; 
    const searchQuery = url.searchParams.get("search_query");

    // Pagination logic
    const skip = (page - 1) * limit;
    const query = {};

   
    if (division) query.division = division;
    if (district) query.district = district;
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } }
      ];
    }

    // Fetch crimes with pagination
    const crimes = await Crime.find(query)
      .populate("user_id", "email phone profile_image")
      .sort({ [sortBy]: -1 }) 
      .skip(skip)
      .limit(limit);

    // Get total crime count
    const totalCrimes = await Crime.countDocuments(query);
    const totalPages = Math.ceil(totalCrimes / limit);

    return NextResponse.json(
      {
        crimes,
        total_pages: totalPages,
        current_page: page
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching crimes:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
