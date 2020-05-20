require("dotenv").config();
const { server, refreshTokens } = require("./src/app");
const io = require("socket.io")(server);
const { authController } = require("./src/websockets/authController");
const { usersController } = require("./src/websockets/usersController");
const { messagesController } = require("./src/websockets/messagesController");

let sockets = [];
/**
 * Los sockets se guardaran en un arreglo de la forma [{socket,id}]
 *
 */

io.on("connection", function (socket) {
  console.log("new user connected");
  authController(socket, refreshTokens, sockets);
  usersController(socket, refreshTokens, sockets);
  messagesController(socket, refreshTokens, sockets);
  socket.on("disconnect", () => {
    const index = sockets.findIndex((e) => e.socket === socket);
    if (index !== -1) {
      sockets.splice(index, 1);
    }
    console.log("disconnect");
  });
});
