import { connectToDB } from "@/app/db/connection";
import { Token } from "@/app/db/models/Token";
import jwt from "jsonwebtoken";
import { User } from "../../db/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // console.log("Login info: ", { email, password });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDB();

    //    find existing user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    //     compare password
    const isPassMatched = await bcrypt.compare(password, user.password);
    if (!isPassMatched) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const access_expiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const refresh_expiry = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    

    //generate access token
    const access_token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
      },
      ACCESS_KEY,
      { expiresIn: "7d" }
    );

    //     generate refresh token
    const refresh_token = jwt.sign({ user_id: user._id }, REFRESH_KEY, {
      expiresIn: "30d",
    });

    const access_expires_at = new Date(Date.now() + access_expiry);
    const refresh_expires_at = new Date(Date.now() + refresh_expiry);

    // save refresh token in db
    await Token.findOneAndUpdate(
     { user_id: user._id },
     { access_token, refresh_token, access_expires_at, refresh_expires_at },
     { upsert: true, new: true }
    );

    return NextResponse.json(
      {
        message: "Logged in successfully!",
        user_id: user._id,
        access_token,
        refresh_token,
        expiredAt: access_expires_at,
        status: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
 