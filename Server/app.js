const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const upload = require("./src/config/multer");
const fs = require("fs");
const {
  generateRefreshToken,
  decodedToken,
  getPublicId,
} = require("./src/helper/helper");
const {
  verifyEmail,
  allPendings,
  clearUrlPending,
} = require("./src/database/database");

var refreshTokens = {};

//Server configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));

//Server routes
app.get("/verification/:token", (req, res) => {
  const { token } = req.params;
  const id = decodedToken(token);
  if (id) {
    verifyEmail(id);
    //res.cookie();

    //generate tokens
    const refreshToken = generateRefreshToken(id);
    refreshTokens[refreshToken] = id;
    res.cookie("Auth", JSON.stringify({ id, token, refreshToken }));
    res.redirect("/#/signup/finish");
  } else {
    res.json({ status: 404, message: "Not found" });
  }
});
app.post("/generateSignature", (req, res) => {
  const { params_to_sign, token } = req.body;
  const userid = decodedToken(token);
  if (userid) {
    const signature = cloudinary.utils.api_sign_request(
      params_to_sign,
      cloudinary.config().api_secret
    );
    res.json({ signature });
  }
});
app.post("/loadfile", upload.single("loadfile"), (req, res) => {
  const file = req.file;
  const _path = path.join(__dirname, "uploads", file.originalname);
  cloudinary.uploader.upload(_path, { folder: "messages" }, (err, result) => {
    fs.unlinkSync(_path);
    if (err) {
      console.log(err);
      res.status(500).json({
        message:
          "Ocurrio un error con el servidor de imagenes, intentelo mas tarde",
      });
      res.end();
    } else {
      res.status(200).json({ url: result.url });
    }
  });
});

//init server
const server = app.listen(app.get("port"), () => {
  setInterval(async () => {
    const pendings = await allPendings();
    pendings.forEach(async (pending) => {
      if (Date.now() - pending.date > 1000 * 60 * 60 * 24) {
        await clearUrlPending(pending.url);
        const publicid = getPublicId(pending.url);
        cloudinary.uploader.destroy(publicid);
      }
    });
  }, 1000 * 60 * 60 * 24);
  console.log("Server on port " + app.get("port"));
});

module.exports = { server, refreshTokens };
