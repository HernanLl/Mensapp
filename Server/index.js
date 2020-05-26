require("dotenv").config();
const { server, refreshTokens } = require("./app");
const io = require("socket.io")(server);
const { authController } = require("./src/websockets/authController");
const { usersController } = require("./src/websockets/usersController");
const { messagesController } = require("./src/websockets/messagesController");
const { uploadController } = require("./src/websockets/uploadController");

let sockets = [];

io.on("connection", function (socket) {
  console.log("new user connected");
  authController(socket, refreshTokens, sockets);
  usersController(socket, refreshTokens, sockets);
  messagesController(socket, refreshTokens, sockets);
  uploadController(socket, refreshTokens, sockets);

  socket.on("disconnect", () => {
    const index = sockets.findIndex((e) => e.socket === socket);
    if (index !== -1) {
      const id = sockets[index].id;
      sockets.splice(index, 1);
      io.emit("user change connection", {
        id,
        connection: false,
      });
    }
    console.log("disconnect");
  });
});
