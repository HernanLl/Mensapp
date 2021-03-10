const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const fs = require("fs");
const routes = require("./src/routes/routes.js");

const { getPublicId } = require("./src/helper/helper");
const { allPendings, clearUrlPending } = require("./src/database/database");

//Server configuration
app.set("port", process.env.PORT);
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3030" }));
app.use(express.static(path.join(__dirname, "dist")));

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("uploads");
}

app.use(routes);

//init server
const server = app.listen(app.get("port"), () => {
  setInterval(async () => {
    const pendings = await allPendings();
    pendings.forEach(async (pending) => {
      if (Date.now() - pending.date > 1000 * 60 * 60 * 24) {
        await clearUrlPending(pending.url);
        const publicid = getPublicId(pending.url);
        cloudinary.uploader.destroy(publicid);
      }
    });
  }, 1000 * 60 * 60 * 24);
  console.log("Server on port " + app.get("port"));
});

module.exports = { server };
