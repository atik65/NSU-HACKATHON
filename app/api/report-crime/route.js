import { connectToDB } from "../../db/connection";
import { Crime } from "@/app/db/models/Crime";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Groq from "groq-sdk";

// Initialize Groq SDK with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Configure Cloudinary
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
    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_KEY);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired access token." },
        { status: 403 }
      );
    }

    if (!decoded || !decoded.user_id) {
      return NextResponse.json(
        { error: "Invalid access token." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, division, district, crime_time, image, video } =
      body;

    console.log(
      title,
      description,
      division,
      district,
      crime_time,
      image,
      video
    );

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
        const formattedImage = image.startsWith("data:image")
          ? image
          : `data:image/jpeg;base64,${image}`;

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
          formattedImage,
          {
            folder: "Reportify",
            resource_type: "auto",
            public_id: `crime_report_${Date.now()}`,
          }
        );

        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: "Image upload failed." },
          { status: 500 }
        );
      }
    }

    await connectToDB();

    // Call AI function for fake report detection
    let aiResponse;
    try {
      const aiResult = await generateFakeDec(description);
      aiResponse = JSON.parse(aiResult); // Ensure AI response is JSON parsed
    } catch (error) {
      console.error("Error parsing AI response:", error);
      aiResponse = { fake: 0, real: 100 }; // Default in case of failure
    }

    // Create a new crime report
    const newCrimeReport = new Crime({
      user_id: decoded.user_id,
      title,
      description,
      division,
      district,
      crime_time,
      image: imageUrl,
      video,
      ai_response: aiResponse,
    });

    // Save the crime report to the database
    const savedReport = await newCrimeReport.save();

    return NextResponse.json(
      {
        crime_id: savedReport._id,
        status: "success",
        message: "Crime report submitted successfully!",
        ai_response: aiResponse,
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

async function generateFakeDec(input) {
  const systemPrompt = `You are best at detecting fake crime reports. Verify the description and return a JSON object like:
  {
    "fake": 70,
    "real": 30
  }.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this report: ${input}` },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 100,
      top_p: 0.8,
      stream: false,
    });

    if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
      throw new Error("Invalid response from Groq API");
    }

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI description:", error);
    throw new Error("Error generating AI response from Groq");
  }
}
