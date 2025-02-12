import { connectToDB } from "@/app/db/connection";
import { User } from "@/app/db/models/User";
import jwt from "jsonwebtoken";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;

export async function authenticate(req) {
 
  try {
    await connectToDB(); 
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Unauthorized", status: 401 };
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,ACCESS_KEY);

    const user = await User.findById(decoded.user_id);
    if (!user) {
      return { error: "User not found", status: 401 };
    }
    return { user };
  } catch (error) {
    return { error: "Invalid Token", status: 401 };
  }
}
