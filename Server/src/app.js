const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const {
  generateRefreshToken,
  decodedToken,
  verifyToken,
} = require("./helper/helper");
const { verifyEmail } = require("./database/database");

const upload = require("./config/multer"); //used to drag and drop

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
