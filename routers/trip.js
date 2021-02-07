const express = require("express");
const { auth } = require("../helpers/auth");
const {
  postTrip,
  getTrip,
  bookTrip,
  deleteTrip,
} = require("../controllers/trip");
const Trip = require("../models/trip");

const router = express.Router();

router.post("/trip", auth(["admin"]), postTrip);
router.get("/trip", getTrip);
router.post("/trip/booking", auth(), bookTrip);
router.delete("/trip", auth(["admin"]), deleteTrip);
router.get("/getAllTrip", async (req, res) => {
  const allTrip = await Trip.find();
  res.send(allTrip);
});

module.exports = router;
