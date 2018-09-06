const socket = io();

/* DOM */
const message = document.getElementById("message-form");
const msgTextbox = document.querySelector("[name=message]");
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
  let formattedTime = moment(msg.createdAt).format("h:mm a");
  let li = document.createElement("li");
  li.textContent = `${msg.from} @ ${formattedTime} : ${msg.text}`;
  messages.appendChild(li);
});

socket.on("newLocationMsg", msg => {
  let formattedTime = moment(msg.createdAt).format("h:mm a");
  let li = document.createElement("li");
  let a = document.createElement("a");

  a.href = msg.url;
  a.target = "_blank";
  a.textContent = "current location";
  li.textContent = `${msg.from} @ ${formattedTime} : `;

  li.appendChild(a);
  messages.appendChild(li);
});

/* Event listeners  */
message.addEventListener("submit", e => {
  e.preventDefault();
  socket.emit(
    "createMsg",
    {
      from: "User",
      text: msgTextbox.value
    },
    () => {
      msgTextbox.value = "";
    }
  );
});

locationBtn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    locationBtn.setAttribute("disabled", "disabled");
    locationBtn.textContent = "Sending Location...";
    navigator.geolocation.getCurrentPosition(
      position => {
        socket.emit(
          "createLocationMsg",
          {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          },
          () => {
            locationBtn.removeAttribute("disabled");
            locationBtn.textContent = "Send Location";
          }
        );
      },
      err => {
        alert("Unable to fetch location");
        locationBtn.removeAttribute("disabled");
        locationBtn.textContent = "Send Location";
      }
    );
  } else {
    return alert("Geolocation not supported by your browser");
  }
});
/* */
