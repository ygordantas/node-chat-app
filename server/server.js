const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMsg } = require("./utils/msg");

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
    console.log("createMsg", msg);
    io.emit("newMsg", generateMsg(msg.from, msg.text));
    callback("this is from the server");
    /*
    socket.broadcast.emit("newMsg", {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });*/
  });
});

server.listen(port, () => {
  console.log(`server running in port ${port}`);
});
