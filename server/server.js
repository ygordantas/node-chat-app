const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMsg, generateLocationMsg } = require("./utils/msg");
const { isRealString, isUniqueUsername } = require("./utils/validation");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  socket.emit("fetchRooms", users.getRoomsList());
  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required");
    }
    // Converting room name to be case insensitive
    params.room = params.room.toUpperCase();
    //--

    if (!users.isUniqueUsername(params.room, params.name)) {
      return callback("Username must be unique");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit("newMsg", generateMsg("Admin", "Welcome to chat app"));
    socket.broadcast
      .to(params.room)
      .emit("newMsg", generateMsg("Admin", `${params.name} has joined`));

    callback();
  });

  socket.on("disconnect", () => {
    const removedUser = users.removeUser(socket.id);
    if (removedUser) {
      io.to(removedUser.room).emit(
        "updateUserList",
        users.getUserList(removedUser.room)
      );
      io.to(removedUser.room).emit(
        "newMsg",
        generateMsg("Admin", `${removedUser.name} has left`)
      );
    }
  });

  socket.on("createMsg", (msg, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(msg.text)) {
      io.to(user.room).emit("newMsg", generateMsg(user.name, msg.text));
    }
    callback();
  });

  socket.on("createLocationMsg", (coords, callback) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMsg",
        generateLocationMsg(user.name, coords.lat, coords.lon)
      );
    }
    callback();
  });
});

server.listen(port, () => {
  console.log(`server running in port ${port}`);
});
