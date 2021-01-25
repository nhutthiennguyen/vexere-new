const mongoose = require("mongoose");
const { SeatSchema } = require("./seat");

const TripSchema = new mongoose.Schema(
  {
    departurePlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    arrivalPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    startedDate: Date,
    departureTime: Date,
    seats: [SeatSchema],
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
    status: String,
    price: Number,
  },
  {
    timestamps: true, // time create
  }
);

const Trip = mongoose.model("Trip", TripSchema);

module.exports = Trip;
