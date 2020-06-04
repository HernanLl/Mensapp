const USERBYID = `SELECT * FROM users WHERE id=$1`;
const USERBYEMAIL = `SELECT * FROM users WHERE email=$1 and erased=false`;
const SAVEUSER = `INSERT INTO users(
    name,
    email,
    password,
    verified,
    urlprofile,
    urlbackground,
    erased
    ) VALUES($1,$2,$3,$4,$5,$6,$7)`;
const UPDATEUSER = `UPDATE users SET 
    name=$1,
    email=$2,
    password=$3,
    urlprofile=$4,
    urlbackground=$5,
    state=$6,
    location=$7 
    WHERE id=$8`;
const VERIFYEMAIL = `UPDATE users SET verified=$1 WHERE id=$2`;
const ERASEACCOUNT = `UPDATE users SET erased=$1 where id=$2`;
const GETUSERS = `SELECT id,name,location,state,urlprofile,urlbackground,erased FROM users WHERE id!=$1`;
const GETMESSAGES = `SELECT * FROM messages 
    WHERE ("to"=$1 and "from"=$2) or ("to"=$2 and "from"=$1) order by("datetime")`;
const GETLATESTMESSAGE = `SELECT * FROM messages WHERE ("to"=$1 and "from"=$2) or ("to"=$2 and "from"=$1) order by messages.datetime desc limit 1;`;
const SAVEMESSAGE = `INSERT INTO messages("to","from",message,"datetime",viewed,urlimage) VALUES($1,$2,$3,$4,$5,$6)`;
const REMOVEUSER = `DELETE FROM users WHERE id=$1`;
const COUNTMESSAGESNOTVIEWED = `SELECT COUNT(*) from messages WHERE ("to"=$1 and "from"=$2) and viewed=false`;
const CHECKALLMESSAGES = `UPDATE messages SET viewed=true WHERE "to"=$1 and "from"=$2`;
const SETNEWPENDING = `INSERT INTO pendings VALUES($1,$2)`;
const CLEARURLPENDING = `DELETE FROM pendings WHERE "url"=$1`;
const ALLPENDINGS = `SELECT * FROM pendings`;
const GETTOKENS = `SELECT * FROM tokens`;
const UPDATETOKEN = `UPDATE tokens SET "token"=$1 where id=$2`;
const SAVETOKEN = `INSERT INTO tokens VALUES($1,$2)`;
const DELETETOKEN = `DELETE FROM tokens WHERE id=$1`;

module.exports = {
  USERBYID,
  USERBYEMAIL,
  SAVEUSER,
  UPDATEUSER,
  VERIFYEMAIL,
  ERASEACCOUNT,
  GETUSERS,
  GETMESSAGES,
  GETLATESTMESSAGE,
  SAVEMESSAGE,
  REMOVEUSER,
  COUNTMESSAGESNOTVIEWED,
  CHECKALLMESSAGES,
  SETNEWPENDING,
  CLEARURLPENDING,
  ALLPENDINGS,
  GETTOKENS,
  UPDATETOKEN,
  SAVETOKEN,
  DELETETOKEN,
};
