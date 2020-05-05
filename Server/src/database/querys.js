const USERBYID = `SELECT * FROM users WHERE id=$1`;
const USERBYEMAIL = `SELECT * FROM users WHERE email=$1`;
const SAVEUSER = `INSERT INTO users(
    name,
    email,
    password,
    verified,
    urlprofile,
    urlbackground
    ) VALUES($1,$2,$3,$4,$5,$6)`;
const UPDATEUSER = `UPDATE users SET 
    name=$1,
    email=$2,
    password=$3,
    urlProfile=$4,
    urlbackground=$5,
    state=$6,
    location=$7 
    WHERE id=$8`;
const VERIFYEMAIL = `UPDATE users SET verified=$1 WHERE id=$2`;
const GETUSERS = `SELECT id,name,location,state,urlprofile,urlbackground FROM users WHERE id!=$1`;
const GETMESSAGES = `SELECT * FROM messages 
    WHERE ("to"=$1 and "from"=$2) or ("to"=$2 and "from"=$1) order by("datetime")`;
const GETLATESTMESSAGE = `SELECT * FROM messages WHERE messages.to=$1 and messages.from=$2 order by messages.datetime desc limit 1;`;
const SAVEMESSAGE = `INSERT INTO messages VALUES($1,$2,$3,$4,$5)`;
const REMOVEUSER = `DELETE FROM users WHERE id=$1`;

module.exports = {
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
};
