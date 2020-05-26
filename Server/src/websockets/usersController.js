const { decodedToken, verifyToken } = require("../helper/helper");
const {
  userById,
  updateUser,
  getUsers,
  getLatestMessage,
  removeUser,
  countMessagesNotViewed,
} = require("../database/database");

function usersController(socket, refreshTokens, sockets) {
  socket.on("user info", async function ({ token, refreshToken, id }) {
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
      if (sockets.findIndex((e) => e.socket === socket) === -1) {
        sockets.push({ socket, id });
      }
      try {
        const {
          name,
          urlprofile,
          urlbackground,
          state,
          location,
        } = await userById(id);
        socket.emit("user info", {
          user: {
            id,
            name,
            urlprofile,
            urlbackground,
            state,
            location,
          },
        });
        socket.broadcast.emit("user change connection", {
          id,
          connection: true,
        });
      } catch (err) {
        socket.emit("error server", {
          code: 401,
          message: "Error internal server",
        });
      }
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });

  socket.on("edit user", async function ({
    token,
    refreshToken,
    id,
    name,
    location,
    state,
    urlprofile,
    urlbackground,
  }) {
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
      await updateUser({ id, name, state, location });
      //emit user info for update view
      socket.emit("user info", {
        user: {
          id,
          name: name,
          urlprofile,
          urlbackground,
          state: state,
          location: location,
        },
      });
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });

  socket.on("get users", async function ({ token, refreshToken, id }) {
    if (verifyToken(token, refreshToken, refreshToken, id, socket)) {
      let users = await getUsers(id);
      for (let i = 0; i < users.length; i++) {
        let latestmessage = null,
          countmessages = 0;
        latestmessage = await getLatestMessage(id, users[i].id);
        countmessages = await countMessagesNotViewed({
          to: id,
          from: users[i].id,
        });
        if (users[i].erased && latestmessage) {
          latestmessage = { message: "CUENTA BORRADA" };
        }
        users[i].latestmessage = latestmessage;
        users[i].countmessages = countmessages;
        const index = sockets.findIndex((e) => e.id === users[i].id);
        if (index !== -1) users[i].connected = true;
      }
      users = users.filter((user) => {
        if (user.erased && !user.latestmessage) return false;
        else return true;
      });
      users = users.sort((a, b) => {
        if (a.latestmessage && b.latestmessage) {
          return b.latestmessage.datetime - a.latestmessage.datetime;
        } else if (a.latestmessage) {
          return -1;
        } else if (b.latestmessage) {
          return 1;
        }
        return 0;
      });
      socket.emit("get users", { users });
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
  socket.on("remove user", async function ({ token }) {
    const id = decodedToken(token);
    if (id) {
      await removeUser(id);
    } else {
      socket.emit("aux", {
        code: 401,
        message: "Token de acceso invalido",
      });
    }
  });
}

module.exports = { usersController };
