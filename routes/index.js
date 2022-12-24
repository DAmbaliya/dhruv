const express = require("express");
const router = express.Router();
const user = require("./user");
const auth = require("./auth");
const { autorize } = require("../middleware/authorixation");

router.use("/", auth);
router.use("/users", autorize, user);

module.exports = router;
