const { verifyCredentials } = require("../helper/helper");
const {
  getMessages,
  saveMessage,
  checkAllMessages,
  userById,
  clearUrlPending,
} = require("../database/database");

function messagesController(socket, sockets) {
  socket.on("get messages", async function ({
    token,
    refreshToken,
    id,
    other,
  }) {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    const messages = await getMessages(id, other);
    socket.emit("get messages", { messages });
  });
  socket.on("new message", async function ({
    token,
    refreshToken,
    id,
    newmessage,
    other,
  }) {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    const { message, datetime, urlimage } = newmessage;
    if (!message && !urlimage) {
      socket.emit("error server", {
        code: 400,
        message: "Debe ingresar un mensaje o una imagen",
      });
      return;
    }
    const user = await userById(other);
    if (user && !user.erased) {
      saveMessage({
        to: other,
        from: id,
        message,
        datetime,
        viewed: false,
        urlimage,
      });
      const socket_other = sockets.find((e) => e.id === other);
      if (socket_other) {
        socket_other.socket.emit("new message", {
          from: id,
          message,
          datetime,
          urlimage,
        });
      }
      clearUrlPending(urlimage);
    }
  });
  socket.on("check all messages", async function ({
    token,
    refreshToken,
    id,
    other,
  }) {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    checkAllMessages({ to: id, from: other });
  });
}

module.exports = { messagesController };
