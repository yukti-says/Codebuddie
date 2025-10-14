import { log } from 'console';
import express from 'express'
const app = express();
import http from 'http'
import {Server }from 'socket.io'


//& passing this server to http so that we can use it in frontend
const server = http.createServer(app);

//& connecting our server to socketIo
const io = new Server(server)

const PORT = process.env.PORT || 4000;

//& io connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
})

//& since our app is based on socket io so our server will listen not app
server.listen(PORT, () =>
  console.log(`server is running on:  http://localhost:${PORT}`)
);