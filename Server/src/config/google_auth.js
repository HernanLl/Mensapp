const googleAuth = require('google-auth-library');

const scope = "https://mail.google.com/";

const credentials = {
    "web": {
        "client_id": "484660170455-voth5f1a06jbl8lecnljfg581h0rjko2.apps.googleusercontent.com",
        "project_id": "sandracosta",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "7iOERKYo4g_hoKDm8TPmQkbX",
        "redirect_uris": ["http://localhost"]
    }
}

function getAuthorizeUrl(callback) {
    const oauth2Client = new googleAuth.OAuth2Client(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scope
    });
    callback(null, authUrl);
}

/** 
getAuthorizeUrl((err, url) => {
    if (err) return console.log(err);
    console.log("Auth url is: ", url);
});*/

const code = "4/ywExV-LS3-yqhUjNmqFJnN5QvW-nBHImki0nWKrjldBmMZIg9MsEO5Hx-sGE5_qFK1Z-jwUBi41OMLwOX78iob8";

function getAccessToken(callback) {
    const oauth2Client = new googleAuth.OAuth2Client(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);
    oauth2Client.getToken(code, (err, token) => {
        if (err) return console.log(err);
        callback(null, token);
    })
}

/** 
getAccessToken((err, token) => {
    if (err) return console.log(err);
    console.log("Auth token is: ", token);
});
*/

const tokens = {
    access_token: 'ya29.a0Ae4lvC3nPbWJ6tl68pfCEctTFZZIrk7NYAtxzAInjFhFjTcoceXhRXM8TT-tfZ1PbGhCUP5VXX_LUrOD0rCXA6X9j4Pu4eRwlzDfLH0afJHKQ77ll9Y9dSwUWDCIX53fP37ZLCdGHfA4vIRX3TrpVzu6m25PFr931MI',
    refresh_token: '1//0hezoU0mX_m93CgYIARAAGBESNwF-L9IrP9c8LZYwg6gHAK5InfkRUjlYtzIWq8TNIzpxO4FRpCOXJ0CtELFqIZOO2MqoWdFr0Fw',
    scope: 'https://mail.google.com/',
    token_type: 'Bearer',
    expiry_date: 1587509950237
}

module.exports = { credentials, getAuthorizeUrl, getAccessToken, tokens }