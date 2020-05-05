const { decodedToken, verifyToken } = require("../utils/utils");
const {
  userById,
  updateUser,
  getUsers,
  getLatestMessage,
  removeUser,
} = require("../database/database");

function usersController(socket, refreshTokens) {
  socket.on("user info", async function ({ token, refreshToken, id }) {
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
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
      } catch (err) {
        socket.emit("error server", {
          code: 500,
          message: "An unexpected error occurred in the database",
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
      await updateUser(id, name, null, null, null, null, state, location);
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
        const latestmessage = await getLatestMessage(id, users[i].id);
        users[i].latestmessage = latestmessage;
      }
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
