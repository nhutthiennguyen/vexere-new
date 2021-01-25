const express = require("express");
const { auth } = require("../helpers/auth");
const router = express.Router();

router.get("/me", auth(), async (req, res) => {
  const result = req.user.toJSON();

  res.send(result);
});

module.exports = router;
