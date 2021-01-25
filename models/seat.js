const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema(
  {
    name: String,
    status: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);
const Seat = mongoose.model("Seat", SeatSchema);

module.exports = { Seat, SeatSchema };
