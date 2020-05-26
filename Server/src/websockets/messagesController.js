const { decodedToken, verifyToken } = require("../helper/helper");
const {
  getMessages,
  saveMessage,
  checkAllMessages,
  userById,
  clearUrlPending,
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
      const { message, datetime, urlimage } = newmessage;
      const user = await userById(other);
      if (user && !user.erased) {
        if (!message && !urlimage) {
          socket.emit("error server", {
            code: 400,
            message: "Debe ingresar un mensaje o una imagen",
          });
        } else {
          await saveMessage({
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
          console.log(urlimage);
          await clearUrlPending(urlimage);
          // TODO - verificar la lista de pendientes, si urlimage esta borrarla
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
