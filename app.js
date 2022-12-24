require("dotenv").config();
require("./config/db");
const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes/index");
const path = require("path");

app.use(express.json({ limit: "50mb" }));
app.use("/api", router);
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`starting port on ${3000}`);
});
