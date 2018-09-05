const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMsg, generateLocationMsg } = require("./utils/msg");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.emit("newMsg", generateMsg("Admin", "Welcome to chat app"));

  socket.broadcast.emit("newMsg", generateMsg("Admin", "New user just joined"));

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("createMsg", (msg, callback) => {
    io.emit("newMsg", generateMsg(msg.from, msg.text));
    callback();
  });

  socket.on("createLocationMsg", (coords, callback) => {
    io.emit(
      "newLocationMsg",
      generateLocationMsg("Admin", coords.lat, coords.lon)
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`server running in port ${port}`);
});
