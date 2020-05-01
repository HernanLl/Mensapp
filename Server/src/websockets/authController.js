const {
  generateHash,
  compareHash,
  generateToken,
  decodedToken,
  generateRefreshToken,
  sendEmail,
  getPublicId,
  verifyToken,
} = require("../utils/utils");
const { userByEmail, saveUser, updateUser } = require("../database/database");
const cloduinary = require("cloudinary").v2;

function authController(socket) {
  var refreshTokens = {};
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
        token = generateToken(user.id);
        refreshToken = generateRefreshToken();
        refreshTokens[refreshToken] = user.id;
      } else {
        status = 400;
        message = "Contraseña incorrecta";
      }
    } else {
      status = 400;
      message = "No existe el usuario ingresado";
      socket.emit("login", { status, message });
    }
    socket.emit("login", { status, message, token, refreshToken, id: user.id });
  });

  socket.on("register", async function ({ name, email, password }) {
    let status = 0,
      message = "",
      token = "",
      refreshToken = "";
    id = -1;
    if (!name || !email || !password) {
      status = 400;
      message = "Campos ingresados invalidos";
    } else {
      const user = await userByEmail(email);
      if (!user) {
        const hash = generateHash(password);
        id = await saveUser(name, email, hash);
        status = 200;
        token = generateToken(id);
        refreshToken = generateRefreshToken();
        refreshTokens[refreshToken] = id;
        //let aux = generateToken(id);
        //const link = 'http://localhost:4000/verification/' + aux;
        //sendEmail('hernanllull@gmail.com',email,'Bienvenido a MENSAPP','Este es un correo de verificacion de cuenta. Ingrese al siguiente link para activar su cuenta: ' + link);
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
    if (verifyToken(token, refreshToken, refreshTokens, id)) {
      await updateUser(
        id,
        null,
        null,
        null,
        urlprofile,
        urlbackground,
        state,
        location
      );
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
  socket.on("remove image", function ({ token, refreshToken, id, url }) {
    if (verifyToken(token, refreshToken, refreshTokens, id)) {
      console.log("hi autenticado");
      const defaultImages = [
        "https://res.cloudinary.com/dqiahaymp/image/upload/v1588341756/aczpr4ub2jcnrp24df0f.jpg",
        "https://res.cloudinary.com/dqiahaymp/image/upload/v1588340109/lxgcj1sbngdfpiqwxdzc.jpg",
      ];
      if (url !== defaultImages[0] && url !== defaultImages[1]) {
        const publicid = getPublicId(url);
        cloduinary.uploader.destroy(publicid);
      }
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
}

module.exports = { authController };
