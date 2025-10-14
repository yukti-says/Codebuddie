import express from 'express'
const app = express();
import http from 'http'
import {Server }from 'socket.io'


//& passing this server to http so that we can use it in frontend
const server = http.createServer(app);

//& connecting our server to socketIo
const io = new Server(server)

const PORT = process.env.PORT || 4000;

//& logic for keeping ids unique for each user
const userSocketMap = {};

//& function to get all the clients in a particular room
const getAllConnectedClients = (roomId) => {
    //& getting all the clients in a particular room
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}



//& io connection
io.on('connection', (socket) => {
    // console.log(`User connected: ${socket.id}`);
    
    socket.on('join', ({ roomId, username }) => {
        // console.log(roomId, username);
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        // & getting all the clients in the room and if they ave already a user then we will send that user to the newly joined user
        // & so that he can see who all are present in the room
        // & we will send this data to all the clients which are already present in the room
        // & so that they can update their client list
        // & io.sockets.adapter.rooms.get(roomId) will give us a set of all the socket ids present in that room
        const clients = getAllConnectedClients(roomId)
        //& notifying all the clients that a new user has joined
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            });
        });
        
    });
})


//& since our app is based on socket io so our server will listen not app
server.listen(PORT, () =>
  console.log(`server is running on:  http://localhost:${PORT}`)
);