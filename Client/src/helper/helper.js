import Cookie from "js-cookie";
export function convertUrlProfile(url, size = 600, gface = true) {
  if (url && url.indexOf("upload") !== -1) {
    return (
      url.substr(0, url.indexOf("upload") + 7) +
      `h_${size},w_${size}${gface ? ",c_fill,g_face" : ""}/` +
      url.substr(url.indexOf("upload") + 7)
    );
  } else {
    return url;
  }
}
export function filterTextByWords(word, count) {
  let index = 0;
  for (let i = 0; i < count; i++) {
    index = word.indexOf(" ", index + 1);
    if (index === -1) break;
  }
  if (index === -1) index = word.length;
  return word.substring(0, index);
}

export function filterTextByCharacters(word, count) {
  if (word.length > count) {
    return word.substring(0, count) + "...";
  } else {
    return word;
  }
}

function getDay(day) {
  switch (day) {
    case 0:
      return "Dom";
    case 1:
      return "Lun";
    case 2:
      return "Mar";
    case 3:
      return "Mie";
    case 4:
      return "Jue";
    case 5:
      return "Vie";
    case 6:
      return "Sab";
    default:
      return null;
  }
}

export function showDatetime(datetime) {
  const actualDate = new Date();
  const messageDate = new Date(datetime);
  const diff = actualDate - messageDate;
  let newdatetime = "";
  if (
    diff < 1000 * 60 * 60 * 24 &&
    actualDate.getDate() === messageDate.getDate()
  ) {
    newdatetime = "Hoy ";
  } else if (
    diff < 1000 * 60 * 60 * 24 * 2 &&
    actualDate.getDate() - messageDate.getDate() === 1
  ) {
    newdatetime = "Ayer ";
  } else if (actualDate.getDate() - messageDate.getDate() < 7) {
    newdatetime = `${getDay(messageDate.getDay())} `;
  } else {
    newdatetime = messageDate.toLocaleDateString() + " ";
  }
  newdatetime +=
    messageDate.getHours() > 9
      ? `${messageDate.getHours()}:`
      : `0${messageDate.getHours()}:`;
  newdatetime +=
    messageDate.getMinutes() > 9
      ? messageDate.getMinutes()
      : `0${messageDate.getMinutes()}`;
  return newdatetime;
}

export function newDate() {
  const d = new Date();
  return `${d.getFullYear()}-${
    d.getMonth() + 1
  }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}

export function getCookie() {
  try {
    return JSON.parse(Cookie.get("Auth") || {});
  } catch (err) {
    return null;
  }
}
export function removeCookie() {
  Cookie.remove("Auth");
}
export function setCookie(token, refreshToken) {
  Cookie.set(
    "Auth",
    {
      token,
      refreshToken,
    },
    { expires: 14 }
  );
}
export function isHome() {
  const location = window.location.protocol + "//" + window.location.host;
  return (
    window.location.href === location + "/#/" ||
    window.location.href === location + "/"
  );
}
