import { connectToDB } from "@/app/db/connection";
import { Token } from "@/app/db/models/Token";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { refresh_token } = body;
    if (!refresh_token) {
      return NextResponse.json(
        { error: "Refresh token is required." },
        { status: 400 }
      );
    }

    //     verify the refresh token
    const decoded = jwt.verify(refresh_token, REFRESH_KEY);
    if (!decoded || !decoded.user_id) {
      return NextResponse.json(
        { error: "Invalid refresh token." },
        { status: 403 }
      );
    }

    await connectToDB();

    //     check if refresh token is in db
    const tokenExist = await Token.findOne({
      user_id: decoded.user_id,
      refresh_token,
    });
    if (!tokenExist) {
      return NextResponse.json(
        { error: "Refresh token not found or expired." },
        { status: 403 }
      );
    }

    //     generate new access token
    const new_access_token = jwt.sign(
      { user_id: decoded.user_id },
      ACCESS_KEY,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "New access token generated successfully!",
        access_token: new_access_token,
        status: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Invalid or expired refresh token." },
      { status: 403 }
    );
  }
}
