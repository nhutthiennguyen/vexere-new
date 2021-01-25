const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    name: String,
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    licensePlace: String,
    seats: Number,
    status: String,
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", CarSchema);

module.exports = Car;
