const { getPublicId, verifyCredentials } = require("../helper/helper");
const {
  updateUser,
  setNewPending,
  defaultImages,
} = require("../database/database");
const cloduinary = require("cloudinary").v2;

function uploadsController(socket) {
  socket.on("update and remove", async function ({
    cookie,
    url,
    newurl,
    selectedImage,
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
    //TODO - revisar
    //socket.broadcast.emit("change user connection", { id, connection: true }); WTF
  });

  socket.on("new pending", async ({ url, cookie }) => {
    const { token, refreshToken } = cookie;
    const id = decodedToken(token);
    if (await !verifyCredentials(token, refreshToken, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "No autorizado, credenciales invalidas",
      });
      return;
    }
    await setNewPending(url);
  });
}

module.exports = { uploadsController };
