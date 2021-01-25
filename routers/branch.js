const express = require("express");
const { auth } = require("../helpers/auth");
const { postBranch, deleteBranch } = require("../controllers/branch");
const router = express.Router();
router.post("/branch", postBranch);
router.delete("/branch", deleteBranch);

module.exports = router;
