import { connectToDB } from "@/app/db/connection";
import { Crime } from "@/app/db/models/Crime";
import { authenticate } from "@/app/api/middleware/middleware";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const auth = await authenticate(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { id } = await params;

   
    const crime = await Crime.findById(id);
    if (!crime) {
      return NextResponse.json(
        { error: "Crime post not found" },
        { status: 404 }
      );
    }
    crime.upvotes += 1;
    await crime.save();
    return NextResponse.json(
      { message: "Crime post upvoted", status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upvote Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
