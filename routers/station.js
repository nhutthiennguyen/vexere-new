const express = require("express");
const router = express.Router();
const { auth } = require('../helpers/auth');
const { postStation, deleteStation, updateStation } = require("../controllers/station");

router.post("/station/create", auth(["admin"]), postStation);
router.delete("/station/delete", auth(["admin"]), deleteStation);
router.patch("/station/update", auth(["admin"]), updateStation)
module.exports = router;
