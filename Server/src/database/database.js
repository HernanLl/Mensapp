const { Pool } = require("pg");
const pool = new Pool(
  process.env.MODE === "production"
    ? {
        connectionString:
          "postgres://qaltaljqhjdced:6a07a8dc2f71a780ab871f074b214fcbe9a5531805c1251a6b30ee06cc61d117@ec2-34-230-149-169.compute-1.amazonaws.com:5432/denamn58knd0s",
      }
    : {}
);
const {
  USERBYID,
  USERBYEMAIL,
  SAVEUSER,
  UPDATEUSER,
  GETUSERS,
  REMOVEUSER,
  GETMESSAGES,
  GETLATESTMESSAGE,
  SAVEMESSAGE,
  COUNTMESSAGESNOTVIEWED,
  CHECKALLMESSAGES,
  SETNEWPENDING,
  CLEARURLPENDING,
  ALLPENDINGS,
  VERIFYEMAIL,
  GETTOKENS,
  UPDATETOKEN,
  SAVETOKEN,
  REMOVETOKEN,
} = require("./querys");

const defaultImages = [
  "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419681/profiles/p6p3qwtz9mq135qy0eqe.jpg",
  "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419759/profiles/qsht38i88qnuthkutfhl.jpg",
];

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
  erased,
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
      erased !== null ? erased : user.erased,
      id,
    ]);
  } catch (err) {
    console.log(err);
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
async function removeUser(id) {
  try {
    await pool.query(REMOVEUSER, [id]);
  } catch (err) {
    console.log(err);
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
async function getLatestMessage(to, from) {
  try {
    const res = await pool.query(GETLATESTMESSAGE, [to, from]);
    return res.rows && res.rows.length === 1 ? res.rows[0] : null;
  } catch (err) {
    return err;
  }
}
async function saveMessage({ to, from, message, datetime, viewed, urlimage }) {
  try {
    await pool.query(SAVEMESSAGE, [
      to,
      from,
      message,
      datetime,
      viewed,
      urlimage,
    ]);
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
async function setNewPending(url) {
  try {
    await pool.query(SETNEWPENDING, [url, Date.now()]);
  } catch (err) {
    console.log(err);
  }
}
async function clearUrlPending(url) {
  try {
    await pool.query(CLEARURLPENDING, [url]);
  } catch (err) {
    console.log(err);
  }
}
async function allPendings(url) {
  try {
    const res = await pool.query(ALLPENDINGS);
    return res.rows;
  } catch (err) {
    console.log(err);
  }
}
async function verifyEmail(id) {
  try {
    await pool.query(VERIFYEMAIL, [true, id]);
  } catch (err) {
    return err;
  }
}
async function getTokens() {
  try {
    const res = await pool.query(GETTOKENS);
    const refreshTokens = {};
    if (res && res.rows) {
      res.rows.forEach((e) => {
        refreshTokens[e.token] = e.id;
      });
    }
    return refreshTokens;
  } catch (err) {
    return err;
  }
}
async function saveToken(token, id) {
  try {
    const res = await pool.query(GETTOKENS);
    if (res && res.rows) {
      if (res.rows.findIndex((e) => e.id === id) !== -1) {
        await pool.query(UPDATETOKEN, [token, id]);
      } else {
        await pool.query(SAVETOKEN, [token, id]);
      }
    }
  } catch (err) {
    return err;
  }
}

async function removeToken(id) {
  try {
    pool.query(REMOVETOKEN, [id]);
  } catch (err) {
    return err;
  }
}

module.exports = {
  userById,
  userByEmail,
  saveUser,
  updateUser,
  getUsers,
  removeUser,
  getMessages,
  getLatestMessage,
  saveMessage,
  countMessagesNotViewed,
  checkAllMessages,
  setNewPending,
  clearUrlPending,
  allPendings,
  verifyEmail,
  getTokens,
  saveToken,
  removeToken,
  defaultImages,
};
