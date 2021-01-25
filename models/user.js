const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    phone: String,
    role: String,
    tokens: {
      type: [String],
      default: [],
    },
    avatar: String,
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;

  return user;
};

//middleware password mongo
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bycrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
