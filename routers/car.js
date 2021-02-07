const express = require("express");
const { postCar, deleteCar, updateCar } = require("../controllers/car");
const { auth } = require("../helpers/auth");
const router = express.Router();
router.post("/car/create", auth(["admin"]), postCar);
router.delete("/car/delete", auth(["admin"]), deleteCar);
router.patch("/car/update", auth(["admin"]), updateCar);

module.exports = router;
