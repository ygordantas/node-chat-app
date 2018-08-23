const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.emit("newMsg", {
    from: "Ygor",
    text: "starting chat app"
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("createMsg", msg => {
    console.log("createMsg", msg);
  });
});

server.listen(port, () => {
  console.log(`server running in port ${port}`);
});
