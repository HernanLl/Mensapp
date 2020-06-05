const {
  generateHash,
  compareHash,
  generateToken,
  generateRefreshToken,
  sendEmail,
  sendEmailPassword,
  getPublicId,
  verifyCredentials,
  decodedToken,
} = require("../helper/helper");
const {
  userById,
  userByEmail,
  saveUser,
  updateUser,
  saveToken,
  removeToken,
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
    if (sockets.find((e) => e.id === user.id)) {
      socket.emit("login", {
        status: 400,
        message: "Ya hay otro usuario utilizando esta cuenta",
      });
      return;
    }
    if (user.erased) {
      socket.emit("login", {
        status: 403,
        message:
          "Su cuenta actualmente esta borrada, registrese para reactivarla",
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
    socket.emit("login", {
      status: 200,
      cookie: { token, refreshToken, id: user.id },
    });
  });

  socket.on("register", async function ({ name, email, password }) {
    if (!name || !email || !password) {
      socket.emit("register", {
        status: 400,
        message: "Los campos no pueden estar vacios",
      });
      return;
    }
    const user = await userByEmail(email);
    if (user && !user.erased) {
      socket.emit("register", {
        status: 400,
        message: "Ya existe un usuario con el mismo email",
      });
      return;
    }
    const hash = generateHash(password);
    let id = -1;
    if (user.erased) {
      id = user.id;
      await updateUser({ id, name, password: hash, erased: false });
    } else {
      id = await saveUser({ name, email, password: hash });
    }
    const token = generateToken(id);
    //Send email
    const link = process.env.URL + "/verification/" + token;
    sendEmail("hernanllull@gmail.com", email, "Bienvenido a MENSAPP", link);
    socket.emit("register", {
      status: 200,
      message:
        "Registrado exitosamente, ingrese a su email para verificar su cuenta",
    });
  });

  socket.on("register complete", async function ({
    urlprofile,
    urlbackground,
    state,
    location,
    cookie,
  }) {
    const { token, refreshToken } = cookie;
    const id = decodedToken(token);
    if (await !verifyCredentials(token, refreshToken, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "No autorizado, credenciales invalidas",
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
    url,
    newurl,
    selectedImage,
    cookie,
  }) {
    const { token, refreshToken } = cookie;
    const id = decodedToken(token);
    if (await !verifyCredentials(token, refreshToken, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "No autorizado, credenciales invalidas",
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

  socket.on("isAuthenticated", async function ({ cookie }) {
    const { token, refreshToken } = cookie;
    const id = decodedToken(token);
    if (verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("isAuthenticated", {});
    }
  });

  socket.on("forgot password email", async function ({ email }) {
    const user = await userByEmail(email);
    if (user) {
      const token = generateToken(user.id);
      const link = process.env.URL + "/forgotpassword/" + token;
      await sendEmailPassword(
        "hernanllull@gmail.com",
        email,
        "Recuperar contraseña",
        link
      );
      socket.emit("forgot password email", {
        status: 200,
        message: "Email enviado con exito, ingrese a su email para continuar",
      });
    } else {
      socket.emit("forgot password email", {
        status: 400,
        message: "No hay ningún usuario registrado con ese email",
      });
    }
  });
  socket.on("forgot password", async function ({ password, cookie }) {
    const { token, refreshToken } = cookie;
    const id = decodedToken(token);
    if (await !verifyCredentials(token, refreshToken, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "No autorizado, credenciales invalidas",
      });
      return;
    }
    const hash = generateHash(password);
    await updateUser({ id, password: hash });
    socket.emit("forgot password", {
      status: 200,
      message: "Contraseña actualizada con exito, ingrese a su cuenta",
    });
  });
  socket.on("forgot password with old", async function ({
    old,
    password,
    cookie,
  }) {
    const { token, refreshToken } = cookie;
    const id = decodedToken(token);
    if (await !verifyCredentials(token, refreshToken, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "No autorizado, credenciales invalidas",
      });
      return;
    }
    const user = await userById(id);
    if (compareHash(old, user.password)) {
      const hash = generateHash(password);
      await updateUser({ id, password: hash });
      socket.emit("forgot password with old", {
        status: 200,
        message: "Contraseña actualizada con exito",
      });
    } else {
      socket.emit("forgot password with old", {
        status: 400,
        message: "Contraseña anterior incorrecta",
      });
    }
  });
  socket.on("logout", async function ({ cookie }) {
    const { token } = cookie;
    const id = decodedToken(token);
    await removeToken(id);
    const index = sockets.findIndex((e) => e.id === id);
    if (index !== -1) {
      sockets.splice(index, 1);
    }
  });
}

module.exports = { authController };
