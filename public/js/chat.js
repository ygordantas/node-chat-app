const socket = io();

// Utility function (Extract query parameters from uri in form of Object)
function deparam(uri) {
  if (uri === undefined) {
    uri = window.location.search;
  }

  let queryString = {};

  uri.replace(new RegExp("([^?=&]+)(=([^&#]*))?", "g"), ($0, $1, $2, $3) => {
    queryString[$1] = decodeURIComponent($3.replace(/\+/g, "%20"));
  });
  return queryString;
}
// ---

/* DOM */
const message = document.getElementById("message-form");
const msgTextbox = document.querySelector("[name=message]");
const messages = document.getElementById("messages");
const locationBtn = document.getElementById("send-location");
/**/

function scrollToBottom() {
  // Selectors
  let newMsg = messages.lastElementChild;
  let prevMsg = newMsg.previousElementSibling;

  // Heights
  let { clientHeight } = messages;
  let { scrollTop } = messages;
  let { scrollHeight } = messages;

  let newMsgStyle = window.getComputedStyle(newMsg);
  let newMsgHeight = parseInt(newMsgStyle.getPropertyValue("height"));
  let lastMsgHeight = 0;
  if (prevMsg) {
    let lastMsgStyle = window.getComputedStyle(prevMsg);
    lastMsgHeight = parseInt(lastMsgStyle.getPropertyValue("height"));
  }
  if (clientHeight + scrollTop + newMsgHeight + lastMsgHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
}

socket.on("connect", () => {
  let params = deparam(window.location.search);

  socket.emit("join", params, err => {
    if (err) {
      alert(err);
      window.location.href = "/";
    }
  });
});

socket.on("disconnect", () => {});

socket.on("updateUserList", users => {
  const ol = document.createElement("ol");

  users.forEach(user => {
    let li = document.createElement("li");
    li.textContent = user;
    ol.appendChild(li);

    document.getElementById("users").innerHTML = "";
    document.getElementById("users").appendChild(ol);
  });
});

socket.on("newMsg", msg => {
  let formattedTime = moment(msg.createdAt).format("h:mm a");
  let template = document.getElementById("message-template").innerHTML;
  let html = Mustache.render(template, {
    from: msg.from,
    text: msg.text,
    createdAt: formattedTime
  });
  messages.innerHTML += html;
  scrollToBottom();
});

socket.on("newLocationMsg", msg => {
  let formattedTime = moment(msg.createdAt).format("h:mm a");
  let template = document.getElementById("location-message-template").innerHTML;
  let html = Mustache.render(template, {
    from: msg.from,
    url: msg.url,
    createdAt: formattedTime
  });
  messages.innerHTML += html;
  scrollToBottom();
});

/* Event listeners  */
message.addEventListener("submit", e => {
  e.preventDefault();
  socket.emit(
    "createMsg",
    {
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
/**/
