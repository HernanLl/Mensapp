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
  GETLATESTMESSAGE,
  SAVEMESSAGE,
  REMOVEUSER,
  COUNTMESSAGESNOTVIEWED,
  CHECKALLMESSAGES,
} = require("./querys");
const { defaultImages } = require("../helper/helper");

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
async function saveUser({ name, email, password }) {
  try {
    await pool.query(SAVEUSER, [
      name,
      email,
      password,
      false,
      //defualt values for images of the new user
      defaultImages[0],
      defaultImages[1],
      false,
    ]);
    const user = await userByEmail(email);
    return user.id;
  } catch (err) {
    console.log(err);
  }
}
async function updateUser({
  id,
  name,
  email,
  password,
  urlprofile,
  urlbackground,
  state,
  location,
}) {
  try {
    const user = await userById(id);
    await pool.query(UPDATEUSER, [
      name || user.name,
      email || user.email,
      password || user.password,
      urlprofile || user.urlprofile,
      urlbackground || user.urlbackground,
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
async function getLatestMessage(to, from) {
  try {
    const res = await pool.query(GETLATESTMESSAGE, [to, from]);
    return res.rows && res.rows.length === 1 ? res.rows[0] : null;
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
async function saveMessage({
  to,
  from,
  message,
  datetime,
  urlprofile,
  viewed,
}) {
  try {
    await pool.query(SAVEMESSAGE, [
      to,
      from,
      message,
      datetime,
      urlprofile,
      viewed,
    ]);
  } catch (err) {
    console.log(err);
  }
}
async function removeUser(id) {
  try {
    await pool.query(REMOVEUSER, [id]);
  } catch (err) {
    console.log(err);
  }
}
async function countMessagesNotViewed({ to, from }) {
  try {
    const res = await pool.query(COUNTMESSAGESNOTVIEWED, [to, from]);
    return res.rows[0].count;
  } catch (err) {
    console.log(err);
  }
}
async function checkAllMessages({ to, from }) {
  try {
    await pool.query(CHECKALLMESSAGES, [to, from]);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  userById,
  userByEmail,
  saveUser,
  verifyEmail,
  updateUser,
  getUsers,
  removeUser,
  getMessages,
  saveMessage,
  getLatestMessage,
  countMessagesNotViewed,
  checkAllMessages,
};