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
// Track latest code for each room so new joiners can be synced
const roomCodeMap = {};

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

    // Send the current room code to the newly joined socket so they get synced
    const currentCode = roomCodeMap[roomId] || "";
    io.to(socket.id).emit("code-change", { code: currentCode });

    console.log(`👥 ${username} joined room ${roomId}`);
  });

  // --- Handle code synchronization ---
  socket.on("code-change", ({ roomId, code }) => {
    // save latest code for the room
    if (roomId) roomCodeMap[roomId] = code;
    socket.to(roomId).emit("code-change", { code });
  });

  // --- Handle user leaving manually ---
  // Listen for the event the client actually emits (leaveRoom)
  socket.on("leaveRoom", ({ roomId, username }) => {
    // capture username before removing map entry
    const leavingUsername = userSocketMap[socket.id] || username;
    socket.leave(roomId);
    delete userSocketMap[socket.id];

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      // emit the event name the client listens to ('left')
      io.to(socketId).emit("left", {
        clients,
        username: leavingUsername,
        socketId: socket.id,
      });
    });

    console.log(`🔴 ${leavingUsername} left room ${roomId}`);
  });

  // --- Handle browser close / tab refresh ---
  socket.on("disconnecting", () => {
    const username = userSocketMap[socket.id];
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: username,
      });
    });

    delete userSocketMap[socket.id];
    console.log(`⚪ ${username || "User"} disconnected.`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
