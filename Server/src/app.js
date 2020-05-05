const path = require("path");
const express = require("express");
const app = express();
const upload = require("./config/multer");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const { decodedToken, verifyToken } = require("./utils/utils");
const { verifyEmail } = require("./database/database");

var refreshTokens = {};

//Setting server
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));

app.get("/verification/:token", (req, res) => {
  const token = req.params.token;
  const id = decodedToken(token);
  if (id) {
    verifyEmail(id);
    res.redirect("/");
  } else {
    res.json({ status: 400, message: "Url no valida" });
  }
});

app.post("/generateSignature", (req, res) => {
  const { params_to_sign, token, refreshToken, id } = req.body;
  if (verifyToken(token, refreshToken, refreshTokens, id)) {
    const signature = cloudinary.utils.api_sign_request(
      params_to_sign,
      cloudinary.config().api_secret
    );
    res.json({ signature });
  }
});

//init server
const server = app.listen(app.get("port"), () => {
  console.log("Server on port " + app.get("port"));
});

module.exports = { server, refreshTokens };
