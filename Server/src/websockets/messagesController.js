const { decodedToken, verifyToken } = require("../utils/utils");
const { getMessages, saveMessage } = require("../database/database");

function messagesController(socket, refreshTokens) {
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
      await saveMessage(other, id, message, datetime, urlprofile);
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
}

module.exports = { messagesController };
