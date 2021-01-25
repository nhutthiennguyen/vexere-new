const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    province: String,
    code: String,
    status: String,
  },
  { timestamps: true }
);
const Station = mongoose.model("Station", StationSchema);

module.exports = Station;
