const { decodedToken, verifyCredentials } = require("../helper/helper");
const {
  userById,
  updateUser,
  getUsers,
  getLatestMessage,
  removeUser,
  countMessagesNotViewed,
} = require("../database/database");

function usersController(socket, sockets, timers) {
  socket.on("user info", async function ({ token, refreshToken, id }) {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    let index =  sockets.findIndex((e) => e.id === id);
    if ( index === -1) {
      console.info("Agregando socket " + socket.connected)
      sockets.push({ socket, id });
    }else{
      console.info("Actualizado socket " + socket.connected)
      sockets[index] = {socket,id};
    }
    //clean the timeout of disconnect
    index = timers.findIndex((e) => e.id === id);
    if (index !== -1) {
      clearTimeout(timers[index].timer);
      timers.splice(index, 1);
    }

    const user = await userById(id);
    if (!user) {
      socket.emit("error server", {
        code: 400,
        message: "No existe el usuario",
      });
    } else {
      const { name, urlprofile, urlbackground, state, location } = user;
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
      socket.broadcast.emit("change user connection", {
        id,
        connection: true,
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
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    //TODO - recibir en el front el evento
    if (!name || !urlprofile || !urlbackground) {
      socket.emit("edit user", {
        code: 400,
        message: "El nombre y las url de imagenes no pueden estar vacios",
      });
      return;
    }
    updateUser({ id, name, state, location });
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
    socket.broadcast.emit("change user", {
      user: {
        id,
        name: name,
        urlprofile,
        urlbackground,
        state: state,
        location: location,
      },
    });
  });

  socket.on("get users", async function ({ token, refreshToken, id }) {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
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
  });
  //TODO - manejar las cookies como cookie y no por partes
  //TODO - manejar borrado de usuarios y emision de evento broadcast
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
