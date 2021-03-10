const express = require("express");
const router = express.Router();
const upload = require("../../src/config/multer");
const cloudinary = require("cloudinary").v2;

const {
  generateRefreshToken,
  decodedToken,
} = require("../../src/helper/helper");
const { verifyEmail, saveToken } = require("../../src/database/database");

router.get("/signup", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

router.get("/signup/finish", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
router.get("/forgot", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

//Server routes
router.get("/verification/:token", (req, res) => {
  const { token } = req.params;
  const id = decodedToken(token);
  if (id) {
    verifyEmail(id);
    //generate tokens
    const refreshToken = generateRefreshToken(id);
    saveToken(refreshToken, id);
    res.cookie("Auth", JSON.stringify({ id, token, refreshToken }));
    res.redirect("/signup/finish");
  } else {
    res.status(404).end();
  }
});
router.get("/forgotpassword/:token", (req, res) => {
  const { token } = req.params;
  const id = decodedToken(token);
  if (id) {
    verifyEmail(id);
    //generate tokens
    const refreshToken = generateRefreshToken(id);
    saveToken(refreshToken, id);
    res.cookie("Auth", JSON.stringify({ id, token, refreshToken }));
    res.redirect("/forgot");
  } else {
    res.status(404).end();
  }
});
router.post("/generateSignature", (req, res) => {
  const auth = JSON.parse(req.cookies.Auth);
  const { params_to_sign } = req.body;
  if (decodedToken(auth.token)) {
    const signature = cloudinary.utils.api_sign_request(
      params_to_sign,
      cloudinary.config().api_secret
    );
    res.json({ signature });
  } else {
    res.status(401).json({ message: "No autorizado, credenciales invalidas" });
  }
});
router.post("/loadfile", upload.single("loadfile"), (req, res) => {
  const auth = JSON.parse(req.cookies.Auth);
  const file = req.file;
  const _path = path.join(__dirname, "uploads", file.originalname);
  if (decodedToken(auth.token)) {
    if (/(.jpg|.png|.jpeg)/i.test(file.originalname)) {
      cloudinary.uploader.upload(
        _path,
        { folder: "messages" },
        (err, result) => {
          if (err) {
            res.status(500).json({
              message:
                "Ocurrio un error con el servidor de imagenes, intentelo mas tarde",
            });
            res.end();
          } else {
            res.status(200).json({ status: 200, url: result.url });
          }
          fs.unlinkSync(_path);
        }
      );
    } else {
      fs.unlinkSync(_path);
      res.end();
    }
  } else {
    fs.unlinkSync(_path);
    res.status(401).json({ message: "No autorizado, credenciales invalidas" });
  }
});

module.exports = router;
