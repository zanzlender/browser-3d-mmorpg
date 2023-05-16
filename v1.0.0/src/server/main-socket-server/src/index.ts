import express from "express";
import { Server } from "socket.io";
import http from "http";
import { ChatMessage, ExtendedSocket } from "./types";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    allowedHeaders: "*",
    methods: "*",
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/:id", (req, res) => {
  res.header({
    "Content-Type": "text/javascript",
  });
  res.sendFile(__dirname + req.url);
});

io.on("connection", (soc) => {
  const socket = soc as ExtendedSocket;

  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User has left");
  });

  //io.emit("rooms", getRooms("connected"));

  socket.on("chat-message", (data: ChatMessage) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);

    // If we have rooms then this
    // io.in(data.room).emit("chat-message", data.msg);
  });

  // Set username
  socket.on("set-username", (name) => {
    console.log("Socket: ", socket.id, " - Updating name to: ", name);
    socket.username = name;
  });

  /*   // Join room
  socket.on("join-room", (room) => {
    console.log("User: ", socket.username, " - Joined room: ", room);
    socket.room = room;
    socket.join(room);
    io.emit("rooms", getRooms("Joined room"));
  });

  // create room
  socket.on("new-room", (room) => {
    console.log("User: ", socket.username, " - Created room: ", room);
    socket.room = room;
    socket.join(room);
    io.emit("rooms", getRooms("new-room"));
  }); */
});

server.listen(3000, () => {
  console.log("Listening on 3000.");
});

/* function getRooms(msg: string) {
  const nsp = io.of("/");
  const rooms = nsp.adapter.rooms;

  // Returns data like: { "roomId1": { "socketid1", "socketId2" } }

  const list = {};

  for (let roomId in rooms) {
    const room = rooms.get(roomId);

    if (room === undefined) continue;

    const sockets = [];
    let roomName = "";

    for (let socketId in room.sockets) {
    }
  }
}
 */
