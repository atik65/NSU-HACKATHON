import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq SDK with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required." },
        { status: 400 }
      );
    }

    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: image }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Hugging Face API Error:", errorData);
      return NextResponse.json(
        { error: "Hugging Face API Error", details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (
      !Array.isArray(result) ||
      result.length === 0 ||
      !result[0].generated_text
    ) {
      return NextResponse.json(
        { error: "Invalid response from Hugging Face API" },
        { status: 500 }
      );
    }

    const imageDescription = result[0].generated_text;

    // Generate description using Groq API
    const aiResponse = await generateDes(imageDescription);

    return NextResponse.json({ aiResponse }, { status: 200 });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// Function to generate a description using Groq API
async function generateDes(input) {
  const systemPrompt = `You are great at writing attention-grabbing descriptions for crime-related posts. Please give me a short, eye-catching description in 1-3 sentences.`;

  try {
    // Request Groq API to generate responses
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate answers for: ${input}` },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.8,
      stream: false,
    });

    if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
      throw new Error("Invalid response from Groq API");
    }

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Error generating description from Groq");
  }
}
