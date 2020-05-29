const {
  getPublicId,
  verifyCredentials,
} = require("../helper/helper");
const { updateUser, setNewPending, defaultImages} = require("../database/database");
const cloduinary = require("cloudinary").v2;

function uploadsController(socket) {
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
    //TODO - revisar
    //socket.broadcast.emit("change user connection", { id, connection: true }); WTF
  });

  socket.on("new pending", async ({ url, token, refreshToken, id }) => {
    if (await !verifyCredentials(token, refreshToken, id, socket)) {
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
      return;
    }
    await setNewPending(url);
  });
}

module.exports = { uploadsController };
