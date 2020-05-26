const { getPublicId, verifyToken, defaultImages } = require("../helper/helper");
const { updateUser, setNewPending } = require("../database/database");
const cloduinary = require("cloudinary").v2;

function uploadController(socket, refreshTokens, sockets) {
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

  socket.on("new pending", async ({ url, token, refreshToken, id }) => {
    if (verifyToken(token, refreshToken, refreshTokens, id, socket)) {
      await setNewPending(url);
    }
  });
}

module.exports = { uploadController };
