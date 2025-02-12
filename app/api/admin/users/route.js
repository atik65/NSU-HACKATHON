import { connectToDB } from "@/app/db/connection.js";
import { User } from "@/app/db/models/User.js";
import { authenticate } from "../../middleware/middleware";


export async function GET(req) {
  try {
    await connectToDB();

    // Authenticate the admin
    const { user, error, status } = await authenticate(req);
    if (error) {
      return Response.json({ message: error }, { status });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return Response.json(
        { message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Fetch all users
    const users = await User.find({}, "email phone verified banned");

    return Response.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
