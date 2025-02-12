import { Server } from "socket.io";
import { connectToDB } from "@/app/db/connection"; // Ensure DB connection before starting WebSocket

let io;

export const initSocketServer = async (server) => {
  if (!io) {
    await connectToDB(); // Ensure DB connection before starting sockets

    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    console.log("🚀 WebSocket server initialized");
  }
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
