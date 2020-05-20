const { decodedToken, verifyToken } = require("../helper/helper");
const {
  getMessages,
  saveMessage,
  checkAllMessages,
  userById,
} = require("../database/database");

function messagesController(socket, refreshTokens, sockets) {
  socket.on("get messages", async function ({
    token,
    refreshToken,
    id,
    other,
  }) {
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
      const messages = await getMessages(id, other);
      socket.emit("get messages", { messages });
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
  socket.on("new message", async function ({
    token,
    refreshToken,
    id,
    newmessage,
    other,
  }) {
    if (verifyToken(token, refreshToken, refreshTokens, id)) {
      const { message, datetime, urlprofile } = newmessage;
      const user = await userById(other);
      console.log(user.erased);
      if (user && !user.erased) {
        await saveMessage({
          to: other,
          from: id,
          message,
          datetime,
          urlprofile,
          viewed: false,
        });
        const socket_other = sockets.find((e) => e.id === other);
        if (socket_other) {
          socket_other.socket.emit("new message", {
            from: id,
            message,
            datetime,
            urlprofile,
          });
        }
      }
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
  socket.on("check all messages", async function ({
    token,
    refreshToken,
    id,
    other,
  }) {
    if (verifyToken(token, refreshToken, refreshTokens, id)) {
      await checkAllMessages({ to: id, from: other });
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
}

module.exports = { messagesController };
