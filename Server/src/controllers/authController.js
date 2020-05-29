const {
  generateHash,
  compareHash,
  generateToken,
  generateRefreshToken,
  sendEmail,
  getPublicId,
  verifyCredentials,
} = require("../helper/helper");
const {
  userByEmail,
  saveUser,
  updateUser,
  saveToken,
  defaultImages,
} = require("../database/database");
const cloduinary = require("cloudinary").v2;

function authController(socket, sockets) {
  socket.on("login", async function ({ email, password }) {
    const user = await userByEmail(email);
    if (!user) {
      socket.emit("login", {
        status: 400,
        message: "No existe el usuario ingresado",
      });
      return;
    }
    if (!compareHash(password, user.password)) {
      socket.emit("login", {
        status: 400,
        message: "Contraseña incorrecta",
      });
      return;
    }
    if (!user.verified) {
      socket.emit("login", {
        status: 403,
        message: "Su email aun no fue verificado",
      });
      return;
    }
    if(sockets.find(e => e.id === user.id)){
      socket.emit("login", {
        status: 400,
        message: "Ya hay otro usuario utilizando esta cuenta",
      });
      return;
    }
    //generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    //save socket and refresh token
    saveToken(refreshToken, user.id);
    sockets.push({ socket, id: user.id });
    //emit new user connected
    socket.broadcast.emit("change user connection", {
      id: user.id,
      connection: true,
    });
    socket.emit("login", { status: 200, token, refreshToken, id: user.id });
  });

  socket.on("register", async function ({ name, email, password }) {
    if (!name || !email || !password) {
      socket.emit("register", {
        status: 400,
        message: "Campos ingresados invalidos",
      });
      return;
    }
    const user = await userByEmail(email);
    if (user) {
      socket.emit("register", {
        status: 400,
        message: "Ya existe un usuario con el mismo email",
      });
      return;
    }

    const hash = generateHash(password);
    id = await saveUser({ name, email, password: hash });
    const token = generateToken(id);
    //Send email
    const link = process.env.URL + "/verification/" + token;
    sendEmail(
      "hernanllull@gmail.com",
      email,
      "Bienvenido a MENSAPP",
      link
    );
    socket.emit("register", { status: 200 });
  });

  socket.on("register complete", async function ({
    token,
    refreshToken,
    id,
    urlprofile,
    urlbackground,
    state,
    location,
  }) {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    await updateUser({
      id,
      urlprofile,
      urlbackground,
      state,
      location,
    });
  });

  socket.on("update and remove", async function ({
    token,
    refreshToken,
    id,
    url,
    newurl,
    selectedImage,
  }) {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    //destroy old image
    if (url !== defaultImages[0] && url !== defaultImages[1]) {
      const publicid = getPublicId(url);
      cloduinary.uploader.destroy(publicid);
    }
    //save url info
    await updateUser({
      id,
      urlprofile: selectedImage === 0 ? newurl : null,
      urlbackground: selectedImage === 1 ? newurl : null,
    });
    socket.broadcast.emit("change user connection", { id, connection: true });
  });

  socket.on("isAuthenticated", async function ({ id, token, refreshToken }) {
    if (verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("isAuthenticated", {});
    }
  });
}

module.exports = { authController };
