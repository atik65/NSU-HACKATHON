import { connectToDB } from "../../../../db/connection";
import { Comment } from "@/app/db/models/Comment";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { authenticate } from "@/app/api/middleware/middleware";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req, { params }) {
  try {
    // Authenticate user
    const auth = await authenticate(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { id } = params;
    const { comment, proof_image, proof_video, user_id } = body;

    if (!comment || !user_id) {
      return NextResponse.json(
        {
          error:
            "Comment and at least one proof (image or video) are required.",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    let imageUrl = null;
    if (proof_image) {
      try {
        if (
          /^data:image/.test(proof_image) ||
          /^[A-Za-z0-9+/=]+$/.test(proof_image)
        ) {
          const formattedImage = proof_image.startsWith("data:image")
            ? proof_image
            : `data:image/jpeg;base64,${proof_image}`;

          const uploadResponse = await cloudinary.uploader.upload(
            formattedImage,
            {
              folder: "Comment",
              resource_type: "image",
              public_id: `crime_report_${Date.now()}`,
            }
          );

          imageUrl = uploadResponse.secure_url;
        } else {
          imageUrl = proof_image;
        }
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: "Image upload failed. Please try again later." },
          { status: 500 }
        );
      }
    }

    const newComment = new Comment({
      user_id,
      crime_id: id,
      comment,
      proof_image: imageUrl,
      proof_video: proof_video || null,
    });

    const savedComment = await newComment.save();

    // if (req.socket.server.io) {
    //   const io = req.socket.server.io
    //   io.to(crime.user_id.toString()).emit("notification", {
    //     type: "new_comment",
    //     message: `New comment on your post: ${crime.title}`,
    //     crimeId: id,
    //     commentId: savedComment._id,
    //   })
    // }

    return NextResponse.json(
      {
        comment_id: savedComment._id,
        status: "success",
        message: "Comment submitted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting comment:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting the comment." },
      { status: 500 }
    );
  }
}
