import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 4000;

//& Store username for each socket.id
const userSocketMap = {};

//& Function to get all connected clients in a room
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

//& Socket.io connection logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  //& When a user joins a room
  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // Notify all clients (including the new one)
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  //& When a user disconnects
  socket.on("disconnect", () => {
    const username = userSocketMap[socket.id];
    delete userSocketMap[socket.id]; // remove from map

    // Find all rooms the socket was in
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit("left", {
          clients,
          username,
          socketId: socket.id,
        });
      });
      });    // No need to delete socket.id from userSocketMap here, as it's already deleted above.
    // The `delete userSocketMap[socket.id];` line handles this.


    console.log(`User disconnected: ${socket.id}`);
  });
});

//& Start the server
server.listen(PORT, () => {
  console.log(`✅ Server is running on: http://localhost:${PORT}`);
});
