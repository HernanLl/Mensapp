const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { gmailTransport } = require("../config/nodemailer_config");
const randtoken = require("rand-token");

function generateHash(password) {
  return bcrypt.hashSync(password, 8);
}
function compareHash(password, hash) {
  return bcrypt.compareSync(password, hash);
}
function generateToken(id) {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "30m",
  });
}
function decodedToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
}
function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "14 days",
  });
}
function verifyToken(token, refreshToken, refreshTokens, id, socket) {
  let authorized = false;
  const userid = decodedToken(token);
  if (userid) {
    authorized = true;
  } else if (id && refreshTokens[refreshToken] === id) {
    const userid_refresh = decodedToken(refreshToken);
    let newtoken = null,
      newrefreshtoken = null;
    if (!userid_refresh) {
      delete refreshTokens[refreshToken];
      newrefreshtoken = generateRefreshToken(id);
      refreshTokens[newrefreshtoken] = id;
    }
    newtoken = generateToken(id);
    socket.emit("new token", { newtoken, newrefreshtoken });
    authorized = true;
  } else {
    socket.emit("error server", {
      code: 401,
      message: "Access token or refresh token invalid",
    });
  }
  return authorized;
}
async function sendEmail(from, to, subject, text) {
  try {
    await gmailTransport.sendMail({
      from,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.log(err);
  }
}
function getPublicId(url) {
  let publicid = "";
  if (url) {
    let aux = url.substring(url.indexOf("upload") + 7);
    aux = aux.substring(aux.indexOf("/") + 1);
    publicid = aux.substr(0, aux.indexOf("."));
  }
  return publicid;
}
const defaultImages = [
  "https://res.cloudinary.com/dqiahaymp/image/upload/v1589148304/i1mtxj9nfxk0s29pmmrl.jpg",
  "https://res.cloudinary.com/dqiahaymp/image/upload/v1588340109/lxgcj1sbngdfpiqwxdzc.jpg",
];

module.exports = {
  generateHash,
  compareHash,
  generateToken,
  decodedToken,
  generateRefreshToken,
  sendEmail,
  getPublicId,
  verifyToken,
  defaultImages,
};
