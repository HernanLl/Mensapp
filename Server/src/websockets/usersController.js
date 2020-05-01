const { decodedToken } = require("../utils/utils");
const {
  userById,
  updateUser,
  getUsers,
  removeUser,
} = require("../database/database");

function usersController(socket) {
  socket.on("user info", async function ({ token }) {
    if (token) {
      const id = decodedToken(token);
      if (id) {
        const user = await userById(id);
        socket.emit("user info", {
          id,
          name: user.name,
          urlProfile: user.urlprofile,
          urlBackground: user.urlbackground,
          state: user.state,
          location: user.location,
        });
      } else {
        console.log("no valido");
        socket.emit("invalid request", {
          code: 401,
          message: "Token de acceso invalido",
        });
      }
    } else {
      console.log("invalid");
      socket.emit("invalid request", {
        code: 401,
        message: "Debe enviar un token de acceso",
      });
    }
  });
  socket.on("edit user", async function ({
    token,
    name,
    location,
    state,
    urlProfile,
    urlBackground,
  }) {
    const id = decodedToken(token);
    if (id) {
      await updateUser(
        id,
        name,
        null,
        null,
        urlProfile,
        urlBackground,
        state,
        location
      );
      //emit user info for update view
      socket.emit("user info", {
        id,
        name: name,
        urlProfile: urlProfile,
        urlBackground: urlBackground,
        state: state,
        location: location,
      });
    } else {
      socket.emit("aux", {
        code: 401,
        message: "Token de acceso invalido",
      });
    }
  });
  socket.on("get users", async function ({ token }) {
    const id = decodedToken(token);
    if (id) {
      const res = await getUsers(id);
      const users = res.map((elem) => {
        return {
          id: elem.id,
          name: elem.name,
          location: elem.location,
          state: elem.state,
          urlProfile: elem.urlprofile,
          urlBackground: elem.urlbackground,
        };
      });
      socket.emit("get users", { users });
    } else {
      socket.emit("aux", {
        code: 401,
        message: "Token de acceso invalido",
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
