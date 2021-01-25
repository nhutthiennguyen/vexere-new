const Branch = require("../models/branch");
const Car = require("../models/car");
const Trip = require("../models/trip");

const postBranch = async (req, res) => {
  try {
    const foundedBranch = await Branch.findOne({ code: req.body.code });

    if (foundedBranch) {
      res.status(400).send({ massage: "Branch has already existed" });
      return;
    }

    const newBranch = new Branch({
      name: req.body.name,
      code: req.body.code,
      hotline: req.body.hotline,
      address: req.body.address,
      status: "active",
    });

    const result = await newBranch.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
const deleteBranch = async (req, res) => {
  const { branchId } = req.body;
  try {
    const foundedBranch = await Branch.findById(branchId);
    if (!foundedBranch)
      return res.status(400).send({ massage: "Invalid branch" });
    if (foundedBranch.status === "inactive")
      return res
        .status(400)
        .send({ message: "branch is had already inactive" });
    const foundedCar = await Car.findOne({ branchId });
    if (foundedCar) {
      const foundedCarInTrip = await Trip.findOne({ carId: foundedCar._id });
      if (foundedCarInTrip)
        return res
          .status(400)
          .send({ massage: "branch is usage, cannot be delete" });
    }
    foundedBranch.status = "inactive";
    const result = await foundedBranch.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ messege: "Something went wrong" });
  }
};
module.exports = {
  postBranch,
  deleteBranch,
};
