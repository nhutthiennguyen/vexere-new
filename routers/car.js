const express = require("express");
const { postCar, deleteCar, updateCar } = require("../controllers/car");
const router = express.Router();
router.post("/car/create", postCar);
router.delete("/car/delete", deleteCar);
router.patch("/car/update", updateCar);

module.exports = router;
