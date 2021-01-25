const mongoose = require("mongoose");
const config = require("config");

const dbUrl = config.get("dbUrl");

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));
