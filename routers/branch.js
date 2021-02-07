const express = require("express");
const { auth } = require("../helpers/auth");
const { postBranch, deleteBranch, updateBranch } = require("../controllers/branch");
const router = express.Router();
router.post("/branch/create", auth(["admin"]), postBranch);
router.delete("/branch/delete", auth(["admin"]), deleteBranch);
router.patch("/branch/update", auth(["admin"]), updateBranch)
module.exports = router;
