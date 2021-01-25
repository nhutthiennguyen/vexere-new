const mongoose = require("mongoose");
const Car = require("../models/car");
const { Seat } = require("../models/seat");
const Station = require("../models/station");
const Ticket = require("../models/ticket");
const Trip = require("../models/trip");

//transaction: tạo ra 1 chuỗi gd, nếu có 1 gd thất bại thì rollback lại tất cả

const postTrip = async (req, res) => {
  let {
    departurePlace,
    arrivalPlace,
    startedDate,
    departureTime,
    carId,
    price,
  } = req.body;
  startedDate = startedDate + " 00:00:00";
  try {
    //check station
    const foundedStation = await Station.find().or([
      { _id: departurePlace },
      { _id: arrivalPlace },
    ]);
    if (foundedStation.length !== 2)
      return res.status(400).send({ message: "invalid station" });
    const foundedCar = await Car.findById(carId);
    if (!foundedCar) return res.status(400).send({ message: "invalid Car" });
    const seatsArr = [...new Array(foundedCar.seats)].map((item, index) => {
      return new Seat({
        name: index,
        status: "avaiable",
      });
    });
    newTrip = new Trip({
      departurePlace,
      arrivalPlace,
      startedDate,
      departureTime,
      seats: seatsArr,
      carId,
      price,
      status: "active",
    });
    const result = await newTrip.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
const getTrip = async (req, res) => {
  let { departure, arrival, date } = req.query;
  date = date + " 00:00:00";
  console.log(date);
  try {
    const foundedTrips = await Trip.find({
      departurePlace: departure,
      arrivalPlace: arrival,
      startedDate: date,
    }).populate("departurePlace arrivalPlace car", "name address licensePlace");
    res.send(foundedTrips);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};

const bookTrip = async (req, res) => {
  const { tripId, seatId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction;
  try {
    //check
    const foundedTrip = await Trip.findById(tripId).session(session);
    if (!foundedTrip)
      return res
        .status(400)
        .send({ message: "Invalid trip. Trip is not exist" });
    const foundedIndex = foundedTrip.seats.findIndex(
      (x) => x._id.toString() === seatId && x.status === "avaiable"
    );
    if (foundedIndex === -1)
      return res.status(400).send({ message: " invalid seat" });
    //update status seat
    foundedTrip.seats[foundedIndex].user = req.user._id;
    foundedTrip.seats[foundedIndex].status = "booked";

    await foundedTrip.save();

    //create ticket with transaction
    await Ticket.create(
      [
        {
          user: req.user._id,
          trip: foundedTrip._id,
          seats: [foundedTrip.seats[foundedIndex]],
        },
      ],
      { session: session }
    );
    await session.commitTransaction();
    session.endSession();
    // const newTicket = new Ticket({
    // user: req.user._id,
    // trip: foundedTrip._id,
    // seats: [foundedTrip.seats[foundedIndex]],
    // });
    // await newTicket.save();
    res.send("success");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ message: "something went wrong" });
  }
};
const deleteTrip = async (req, res) => {
  const { id } = req.query;
  try {
    const foundedTrip = await Trip.findById(id);
    if (!foundedTrip || foundedTrip.status === "inactive")
      return res
        .status(400)
        .send({ message: "invalid trip or tri had already inactive" });
    const foundedSeat = foundedTrip.seats.filter((x) => x.status === "booked");
    if (foundedSeat.length > 0)
      return res
        .status(400)
        .send({ message: "trip have passenger, cannot be delete" });
    foundedTrip.status = "inactive";
    const result = await foundedTrip.save();
    res.send(result);
  } catch (error) {}
};
module.exports = {
  postTrip,
  getTrip,
  bookTrip,
  deleteTrip,
};
