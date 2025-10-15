import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev (change to your frontend URL in prod)
  },
});

const PORT = process.env.PORT || 4000;

// Track usernames for each socket ID
const userSocketMap = {};

// Helper function — returns all clients in a room
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
};

// Main socket connection
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // --- User joins a room ---
  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // Notify everyone (including the new user)
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username: userSocketMap[socket.id],
        socketId: socket.id,
      });
    });

    console.log(`👥 ${username} joined room ${roomId}`);
  });

  // --- Handle code synchronization ---
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", { code });
  });

  // --- Handle user leaving manually ---
  socket.on("leave-room", ({ roomId, username }) => {
    socket.leave(roomId);
    delete userSocketMap[socket.id];

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("user-left", {
        clients,
        username: userSocketMap[socket.id],
        socketId: socket.id,
      });
    });

    console.log(`🔴 ${username} left room ${roomId}`);
  });

  // --- Handle browser close / tab refresh ---
  socket.on("disconnecting", () => {
    const username = userSocketMap[socket.id];
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit('disconnected', {
        socketId: socket.id,
        username:userSocketMap[socket.id]
      })
    });

    delete userSocketMap[socket.id];
    console.log(`⚪ ${username || "User"} disconnected.`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
