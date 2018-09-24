const socket = io();

const dropdown = document.getElementById("dropdown");
const selectBox = document.getElementById("select-box-template");
const roomNameInput = document.getElementById("room-name-input");

socket.on("connect", () => {
  socket.on("fetchRooms", data => {
    let template = selectBox.innerHTML;
    data.forEach(room => {
      // Using mustache
      let html = Mustache.render(template, { room: room });
      dropdown.insertAdjacentHTML("beforeend", html);

      /* Using vanilla javascript
      let option = document.createElement("option");
      option.textContent = room;
      option.value = room;
      dropdown.appendChild(option);
      */
    });
  });
});

selectRoom = e => {
  roomNameInput.value = e.target.value;
};
