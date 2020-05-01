const { Pool } = require("pg");
const pool = new Pool();
const {
  USERBYID,
  USERBYEMAIL,
  SAVEUSER,
  UPDATEUSER,
  VERIFYEMAIL,
  GETUSERS,
  GETMESSAGES,
  SAVEMESSAGE,
  REMOVEUSER,
} = require("./querys");

async function userById(id) {
  try {
    const res = await pool.query(USERBYID, [id]);
    return res.rows && res.rows.length > 0 ? res.rows[0] : null;
  } catch (err) {
    console.log(err);
  }
}

async function userByEmail(email) {
  try {
    const res = await pool.query(USERBYEMAIL, [email]);
    return res.rows && res.rows.length > 0 ? res.rows[0] : null;
  } catch (err) {
    console.log(err);
  }
}
async function saveUser(name, email, password) {
  try {
    await pool.query(SAVEUSER, [
      name,
      email,
      password,
      false,
      //defualt values for images of the new user
      "https://res.cloudinary.com/dqiahaymp/image/upload/v1587416862/itpdxlrhuyqlfg8qiorg.jpg",
      "https://res.cloudinary.com/dqiahaymp/image/upload/v1587509200/mcnvvwtvvvior87ljb9m.jpg",
    ]);
    const user = await userByEmail(email);
    return user.id;
  } catch (err) {
    return err;
  }
}
async function updateUser(
  id,
  name,
  email,
  password,
  urlProfile,
  urlBackground,
  state,
  location
) {
  try {
    const user = await userById(id);
    await pool.query(UPDATEUSER, [
      name || user.name,
      email || user.email,
      password || user.password,
      urlProfile || user.urlProfile,
      urlBackground || user.urlBackground,
      state || user.state,
      location || user.location,
      id,
    ]);
  } catch (err) {
    return err;
  }
}
async function verifyEmail(id) {
  try {
    await pool.query(VERIFYEMAIL, [true, id]);
  } catch (err) {
    return err;
  }
}
async function getUsers(id) {
  try {
    const res = await pool.query(GETUSERS, [id]);
    return res.rows;
  } catch (err) {
    return err;
  }
}
async function getMessages(id, other) {
  try {
    const res = await pool.query(GETMESSAGES, [id, other]);
    return res.rows;
  } catch (err) {
    return err;
  }
}
async function saveMessage(
  to,
  from,
  message,
  url,
  datetime,
  view,
  received,
  urlProfile
) {
  try {
    await pool.query(SAVEMESSAGE, [
      to,
      from,
      message,
      url,
      datetime,
      view,
      received,
      urlProfile,
    ]);
  } catch (err) {
    return err;
  }
}
async function removeUser(id) {
  try {
    await pool.query(REMOVEUSER, [id]);
  } catch (err) {
    return err;
  }
}

module.exports = {
  userById,
  userByEmail,
  saveUser,
  updateUser,
  verifyEmail,
  getUsers,
  getMessages,
  saveMessage,
  removeUser,
};
