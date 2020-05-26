const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { gmailTransport } = require("../config/nodemailer_config");

function generateHash(password) {
  return bcrypt.hashSync(password, 8);
}
function compareHash(password, hash) {
  return bcrypt.compareSync(password, hash);
}
function generateToken(id) {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "10m",
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
    let newtoken = null;
    if (!userid_refresh) {
      delete refreshTokens[refreshToken];
      authorized = false;
      socket.emit("error server", {
        code: 401,
        message: "Access token or refresh token invalid",
      });
    } else {
      if (socket) {
        newtoken = generateToken(id);
        socket.emit("new token", { newtoken });
      }
      authorized = true;
    }
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
  "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419681/profiles/p6p3qwtz9mq135qy0eqe.jpg",
  "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419759/profiles/qsht38i88qnuthkutfhl.jpg",
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
