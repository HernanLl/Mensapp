const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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
  getTokens,
  saveToken,
} = require("./src/database/database");

//Server configuration
app.set("port", process.env.PORT);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3030" }));
app.use(express.static(path.join(__dirname, "dist")));

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("uploads");
}

app.get("/signup/finish", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

//Server routes
app.get("/verification/:token", (req, res) => {
  const { token } = req.params;
  console.log(token);
  console.log("token");
  const id = decodedToken(token);
  if (id) {
    verifyEmail(id);
    //generate tokens
    const refreshToken = generateRefreshToken(id);
    saveToken(refreshToken, id);
    res.cookie("Auth", JSON.stringify({ id, token, refreshToken }));
    res.redirect("/signup/finish");
  } else {
    console.log("fallo");
    res.status(404).end();
  }
});
app.get("/forgotpassword/:token", (req, res) => {
  const { token } = req.params;
  const id = decodedToken(token);
  if (id) {
    verifyEmail(id);
    //generate tokens
    const refreshToken = generateRefreshToken(id);
    saveToken(refreshToken, id);
    res.cookie("Auth", JSON.stringify({ id, token, refreshToken }));
    res.redirect("/#/forgot");
  } else {
    res.status(404).end();
  }
});
app.post("/generateSignature", (req, res) => {
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
app.post("/loadfile", upload.single("loadfile"), (req, res) => {
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

module.exports = { server };
