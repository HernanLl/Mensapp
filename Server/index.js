require("dotenv").config();
const { server } = require("./app");
const io = require("socket.io")(server);
const { authController } = require("./src/controllers/authController");
const { usersController } = require("./src/controllers/usersController");
const { messagesController } = require("./src/controllers/messagesController");
const { uploadsController } = require("./src/controllers/uploadsController");

let sockets = [];
let timers = [];

io.on("connection", function (socket) {
  console.log("new user connected");
  authController(socket, sockets);
  usersController(socket, sockets, timers);
  messagesController(socket, sockets);
  uploadsController(socket, sockets);

  socket.on("disconnect", () => {
    const index = sockets.findIndex((e) => e.socket.id === socket.id);
    if (index !== -1) {
      console.log("Se encontrol el socket de: " + sockets[index].id);
      const timer = setTimeout(() => {
        const id = sockets[index].id;
        sockets.splice(index, 1);
        io.emit("change user connection", {
          id,
          connection: false,
        });
      }, 1000 * 60 * 3);
      timers.push({ id: sockets[index].id, timer });
    }
    console.log("disconnect");
  });
});
