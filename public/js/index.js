const socket = io();
const message = document.getElementById("message-form");
const text = document.querySelector("[name=message]");
const messages = document.getElementById("messages");

socket.on("connect", function() {
  console.log("Connected to the server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMsg", function(msg) {
  let li = document.createElement("li");
  let text = document.createTextNode(`${msg.from}: ${msg.text}`);
  li.appendChild(text);
  messages.appendChild(li);
});

message.addEventListener("submit", function(e) {
  e.preventDefault();
  socket.emit(
    "createMsg",
    {
      from: "User",
      text: text.value
    },
    function() {}
  );
});
