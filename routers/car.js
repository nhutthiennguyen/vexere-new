const express = require("express");
const { postCar, deleteCar, updateCar } = require("../controllers/car");
const router = express.Router();
router.post("/car", postCar);
router.delete("/car", deleteCar);
router.patch("/car", updateCar);

module.exports = router;
