const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { gmailTransport } = require("../config/nodemailer_config");
const { getTokens } = require("../database/database");

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
    const decoded = jwt.decode(token, process.env.SECRET);
    console.log("Decoded token");
    console.log(decoded);
    return decoded.id;
  } catch (err) {
    return null;
  }
}
function verifyToken(token) {
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
async function verifyCredentials(token, refreshToken, socket) {
  const id = decodedToken(token);
  const refreshTokens = await getTokens();
  let authorized = false;
  const userid = verifyToken(token);
  if (userid) {
    authorized = true;
  } else if (id && refreshTokens[refreshToken] === id) {
    const userid_refresh = verifyToken(refreshToken);
    let newtoken = null;
    if (!userid_refresh) {
      authorized = false;
      socket.emit("error server", {
        code: 401,
        message: "No autorizado, credenciales invalidas",
      });
    } else {
      if (socket) {
        newtoken = generateToken(id);
        if (socket && socket.emit) {
          socket.emit("new token", { newtoken });
        }
      }
      authorized = true;
    }
  } else {
    socket.emit("error server", {
      code: 401,
      message: "No autorizado, credenciales invalidas",
    });
  }
  return authorized;
}
async function sendEmail(from, to, subject, link) {
  try {
    await gmailTransport.sendMail({
      from,
      to,
      subject,
      html: `
          <div class="container" style="padding:1rem;font-family: sans-serif;" >
              <p style="margin-bottom:2rem">
                  Bienvenido a la comunidad de Mensapp, para finalizar su registro debe 
              </p>
              <a href="${link}" class="link" style="padding: 1rem 2rem;background-color: #33b5e5;color: white;border:none;border-radius: 3rem;cursor: pointer;text-decoration:none;">Validar su cuenta</a>
          </div>
      `,
    });
  } catch (err) {
    console.log(err);
  }
}
async function sendEmailPassword(from, to, subject, link) {
  try {
    await gmailTransport.sendMail({
      from,
      to,
      subject,
      html: `
          <div class="container" style="padding:1rem;font-family: sans-serif;" >
              <p style="margin-bottom:2rem">
                  Para cambiar su contraseña 
              </p>
              <a href="${link}" class="link" style="padding: 1rem 2rem;background-color: #33b5e5;color: white;border:none;border-radius: 3rem;cursor: pointer;text-decoration:none;">Ingrese aqui</a>
          </div>
      `,
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
  sendEmailPassword,
  getPublicId,
  verifyCredentials,
};
