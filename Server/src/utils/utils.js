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
    expiresIn: 60 * 60 * 24 * 14,
  });
}
function decodedToken(token) {
  const decoded = jwt.decode(token, process.env.SECRET);
  return decoded ? decoded.id : null;
}
function generateRefreshToken() {
  return randtoken.uid(256);
}
//Verificar si es correcto
function verifyToken(token, refreshToken, refreshTokens, id) {
  let authorized = false;
  const userid = decodedToken(token);
  if (!userid) {
    if (refreshTokens[refreshToken] === id) {
      const newtoken = generateToken(id);
      socket.emit("new token", { newtoken });
      authorized = true;
    }
  } else {
    authorized = true;
  }
  return authorized;
}

async function sendEmail(from, to, subject, text) {
  try {
    const info = await gmailTransport.sendMail({
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

module.exports = {
  generateHash,
  compareHash,
  generateToken,
  decodedToken,
  generateRefreshToken,
  sendEmail,
  getPublicId,
  verifyToken,
};
