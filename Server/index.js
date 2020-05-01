require("dotenv").config();
const { server } = require("./src/app");
const io = require("socket.io")(server);
const { authController } = require("./src/websockets/authController");
const { usersController } = require("./src/websockets/usersController");
const { messagesController } = require("./src/websockets/messagesController");

io.on("connection", function (socket) {
  console.log("new user connected");
  authController(socket);
  usersController(socket);
  messagesController(socket);
});
