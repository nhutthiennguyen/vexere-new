const express = require("express");
const { createUser, signIn, logOut, updateUser } = require("../controllers/user");
const { auth } = require("../helpers/auth");
const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", signIn);
router.post("/logout", auth(), logOut);
router.patch("/update", updateUser);
module.exports = router;
