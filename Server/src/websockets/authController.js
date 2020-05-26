const {
  generateHash,
  compareHash,
  generateToken,
  generateRefreshToken,
  sendEmail,
  getPublicId,
  verifyToken,
  defaultImages,
} = require("../helper/helper");
const { userByEmail, saveUser, updateUser } = require("../database/database");
const cloduinary = require("cloudinary").v2;

function authController(socket, refreshTokens, sockets) {
  socket.on("login", async function ({ email, password }) {
    let status = 0,
      message = "",
      token = "",
      refreshToken = "",
      id = -1;
    const user = await userByEmail(email);
    if (user) {
      if (compareHash(password, user.password)) {
        status = 200;
        message = "logueado exitosamente";
        id = user.id;

        if (user.verified) {
          //generate tokens
          token = generateToken(user.id);
          refreshToken = generateRefreshToken(id);
          //save socket and refresh token
          refreshTokens[refreshToken] = user.id;
          sockets.push({ socket, id });
          //emit new user connected
          socket.broadcast.emit("user change connection", {
            id,
            connection: true,
          });
        } else {
          status = 403;
          message = "Su email aun no fue verificado";
        }
      } else {
        status = 400;
        message = "Contraseña incorrecta";
      }
    } else {
      status = 400;
      message = "No existe el usuario ingresado";
    }
    socket.emit("login", { status, message, token, refreshToken, id });
  });

  socket.on("register", async function ({ name, email, password }) {
    let status = 0,
      message = "",
      token = "",
      refreshToken = "",
      id = -1;
    if (!name || !email || !password) {
      status = 400;
      message = "Campos ingresados invalidos";
    } else {
      const user = await userByEmail(email);
      if (!user) {
        const hash = generateHash(password);
        id = await saveUser({ name, email, password: hash });
        status = 200;
        //Send email
        token = generateToken(id);
        const link = "http://localhost:3000/verification/" + token;
        sendEmail(
          "hernanllull@gmail.com",
          email,
          "Bienvenido a MENSAPP",
          "Este es un correo de verificacion de cuenta. Ingrese al siguiente link para activar su cuenta: " +
            link
        );
      } else {
        status = 400;
        message = "Ya existe un usario con el mismo email";
      }
    }
    socket.emit("register", { status, message, token, refreshToken, id });
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
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
      await updateUser({
        id,
        urlprofile,
        urlbackground,
        state,
        location,
      });
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });

  socket.on("update and remove", async function ({
    token,
    refreshToken,
    id,
    url,
    newurl,
    selectedImage,
  }) {
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
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
      socket.broadcast.emit("user change connection", { id, connection: true });
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });

  socket.on("isAuthenticated", async function ({ id, token, refreshToken }) {
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
      socket.emit("isAuthenticated", {});
    }
  });
}

module.exports = { authController };
