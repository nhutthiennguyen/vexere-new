const Station = require("../models/station");
const Trip = require("../models/trip");

const postStation = async (req, res) => {
  try {
    const { name, address, province, code } = req.body;
    const foundedStation = await Station.findOne({ code });
    if (foundedStation)
      return res.status(400).send({ message: "Station had already" });
    const newStation = new Station({
      name,
      address,
      province,
      code,
      status: "active",
    });
    const result = await newStation.save();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }
};
const deleteStation = async (req, res) => {
  const { id } = req.query;
  try {
    const foundedStation = await Station.findById(id);
    if (!foundedStation || foundedStation.status === "inactive")
      return res
        .status(400)
        .send({ message: "invalid station or station had already inactive" });
    const foundedTrip = await Trip.find().or([
      { departurePlace: id },
      { arrivalPlace: id },
    ]);
    if (foundedTrip.length > 0)
      return res
        .status(400)
        .send({ message: "station is usage, cannot be delete" });
    foundedStation.status = "inactive";
    const result = await foundedStation.save(result);
    res.send();
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = {
  postStation,
  deleteStation,
};
