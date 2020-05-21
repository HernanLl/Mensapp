const credentials = {
  web: {
    client_id:
      "484660170455-voth5f1a06jbl8lecnljfg581h0rjko2.apps.googleusercontent.com",
    client_secret: process.env.CLIENT_SECRET,
  },
};

const tokens = {
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
  expiry_date: 1587509950237,
};

module.exports = { credentials, tokens };
