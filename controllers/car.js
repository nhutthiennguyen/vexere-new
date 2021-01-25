const Car = require("../models/car");
const Trip = require("../models/trip");

const postCar = async (req, res) => {
  try {
    const { name, branchId, licensePlace, seats } = req.body;
    const foundCar = await Car.findOne({ licensePlace });
    if (foundCar)
      return res
        .status(400)
        .send({ message: "License place had already existed" });
    const newCar = new Car({
      name,
      branchId,
      licensePlace,
      seats,
      status: "active",
    });
    const result = await newCar.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
const deleteCar = async (req, res) => {
  const { id } = req.query;
  try {
    const foundedCar = await Car.findById(id);
    if (!foundedCar) return res.status(400).send({ message: "Invalid car" });
    if (foundedCar.status === "inactive")
      return res.status(400).send({ message: "car is had already inactive" });
    if (foundedCar) {
      const foundedTrip = await Trip.findOne({ id });
      if (foundedTrip)
        return res
          .status(400)
          .send({ message: "car is usage, cannot be delete" });
    }
    foundedCar.status = "inactive";
    await foundedCar.save();
    res.send("success");
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }
};
const updateCar = async (req, res) => {
  const { licensePlace, name, branchId, seats } = req.body;
  try {
    const foundedCar = await Car.findOne({ licensePlace });
    if (!foundedCar) return res.status(400).send({ message: "Invalid Car" });
    foundedCar.name = name;
    foundedCar.branchId = branchId;
    foundedCar.seats = seats;
    await foundedCar.save();
    res.send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = {
  postCar,
  deleteCar,
  updateCar,
  deleteCar,
};
