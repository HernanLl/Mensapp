const { decodedToken } = require("../utils/utils");
const { getMessages, saveMessage } = require("../database/database");

function messagesController(socket) {
  socket.on("get messages", async function ({ token, other }) {
    const id = decodedToken(token);
    if (id) {
      const data = await getMessages(id, other);
      const messages = data.map((elem) => {
        return {
          to: elem.to,
          from: elem.from,
          message: elem.message,
          url: elem.url,
          datetime: elem.datetime,
          view: elem.view,
          received: elem.received,
          urlProfile: elem.urlprofile,
        };
      });
      socket.emit("get messages", { messages });
    } else {
      socket.emit("aux", {
        code: 401,
        message: "Token de acceso invalido",
      });
    }
  });
  socket.on("new message", async function ({
    token,
    other,
    message,
    datetime,
    urlProfile,
  }) {
    const id = decodedToken(token);
    if (id) {
      await saveMessage(
        other,
        id,
        message,
        "",
        datetime,
        false,
        false,
        urlProfile
      );
    } else {
      socket.emit("aux", {
        code: 401,
        message: "Token de acceso invalido",
      });
    }
  });
}

module.exports = { messagesController };
