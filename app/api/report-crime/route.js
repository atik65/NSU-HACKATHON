import { connectToDB } from "../../db/connection";
import { Crime } from "@/app/db/models/Crime";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;

export async function POST(req) {
  try {
    // Check for authorization header
    const authorization = req.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token is required." },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1];

    // Verify the access token
    const decoded = jwt.verify(token, ACCESS_KEY);
    if (!decoded || !decoded.user_id) {
      return NextResponse.json(
        { error: "Invalid or expired access token." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, division, district, crime_time, image, video } =
      body;

    // Validate the request body
    if (!title || !description || !division || !district || !crime_time) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Handle image upload if provided
    let imageUrl = "";
    if (image) {
      try {
        // If the image is a base64 string, ensure it is correctly formatted
        const formattedImage = image.startsWith("data:image")
          ? image
          : `data:image/jpeg;base64,${image}`;

        // Upload the image using Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
          formattedImage,
          {
            folder: "Reportify", // Save to a folder named 'Reportify'
            resource_type: "auto", // Automatically detect image/video type (important for base64)
            public_id: `crime_report_${Date.now()}`, // Use a custom public ID
          }
        );

        imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image

        console.log(imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: "Image upload failed." },
          { status: 500 }
        );
      }
    }

    await connectToDB();

    // Create a new crime report
    const newCrimeReport = new Crime({
      user_id: decoded.user_id,
      title,
      description,
      division,
      district,
      crime_time,
      image: imageUrl,
      video, // You can handle video here if required (validate or upload)
    });

    // Save the crime report to the database
    const savedReport = await newCrimeReport.save();

    return NextResponse.json(
      {
        crime_id: savedReport._id,
        // savedReport,
        status: "success",
        message: "Crime report submitted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reporting crime:", error);
    return NextResponse.json(
      { error: "An error occurred while reporting the crime." },
      { status: 500 }
    );
  }
}
