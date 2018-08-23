const socket = io();

socket.on("connect", function() {
  console.log("Connected to the server");

  socket.emit("createMsg", {
    from: "Browser",
    text: "Straight from google chrome"
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMsg", function(msg) {
  console.log("New message", msg);
});
