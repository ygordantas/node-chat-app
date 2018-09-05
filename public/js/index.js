const socket = io();

/* DOM */
const message = document.getElementById("message-form");
const text = document.querySelector("[name=message]");
const messages = document.getElementById("messages");
const locationBtn = document.getElementById("send-location");
/* */

socket.on("connect", () => {
  console.log("Connected to the server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("newMsg", msg => {
  let li = document.createElement("li");
  li.textContent = `${msg.from}: ${msg.text}`;
  messages.appendChild(li);
});

socket.on("newLocationMsg", msg => {
  let li = document.createElement("li");
  let a = document.createElement("a");

  a.href = msg.url;
  a.target = "_blank";
  a.textContent = "current location";
  li.textContent = `${msg.from}: `;

  li.appendChild(a);
  messages.appendChild(li);
});

/* DOM Event listeners  */
message.addEventListener("submit", e => {
  e.preventDefault();
  socket.emit(
    "createMsg",
    {
      from: "User",
      text: text.value
    },
    () => {}
  );
});

locationBtn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        socket.emit("createLocationMsg", {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      err => {
        alert("Unable to fetch location");
      }
    );
  } else {
    return alert("Geolocation not supported by your browser");
  }
});
/* */
