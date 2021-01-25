const mongoose = require("mongoose");
const { SeatSchema } = require("./seat");

const TicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    seats: [SeatSchema],
  },
  { timestamps: true }
);
const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket;
