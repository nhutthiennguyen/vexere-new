const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
    },
    hotline: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true, // time create
  }
);

const Branch = mongoose.model("Branch", BranchSchema);

module.exports = Branch;
