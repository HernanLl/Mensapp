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

        //generate tokens
        token = generateToken(user.id);
        refreshToken = generateRefreshToken(id);

        //save socket and refresh token
        refreshTokens[refreshToken] = user.id;
        sockets[id] = socket;
      } else {
        status = 400;
        message = "Contraseña incorrecta";
      }
    } else {
      status = 400;
      message = "No existe el usuario ingresado";
      socket.emit("login", { status, message });
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
        id = await saveUser(name, email, hash);
        status = 200;
        //generate tokens
        token = generateToken(id);
        refreshToken = generateRefreshToken(id);

        /** Send email 
        const link = "http://localhost:3000/verification/" + token;
        sendEmail(
          "hernanllull@gmail.com",
          email,
          "Bienvenido a MENSAPP",
          "Este es un correo de verificacion de cuenta. Ingrese al siguiente link para activar su cuenta: " +
            link
        );
        */

        //save socket and refresh token
        refreshTokens[refreshToken] = id;
        sockets[id] = socket;
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
      const defaultImages = [
        "https://res.cloudinary.com/dqiahaymp/image/upload/v1588341756/aczpr4ub2jcnrp24df0f.jpg",
        "https://res.cloudinary.com/dqiahaymp/image/upload/v1588340109/lxgcj1sbngdfpiqwxdzc.jpg",
      ];
      if (url !== defaultImages[0] && url !== defaultImages[1]) {
        const publicid = getPublicId(url);
        cloduinary.uploader.destroy(publicid);
      }
      //save url info
      await updateUser(
        id,
        null,
        null,
        null,
        selectedImage === 0 ? newurl : null,
        selectedImage === 1 ? newurl : null,
        null,
        null
      );
    } else {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    }
  });
}

module.exports = { authController };
