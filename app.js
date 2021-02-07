require("./db/connect");
const express = require("express");
const path = require("path"); // package to build url staticp
const bodyParser = require("body-parser");
const config = require("config");
const tripRouter = require("./routers/trip");
const branchRouter = require("./routers/branch");
const carRouter = require("./routers/car");
const stationRouter = require("./routers/station");
const userRouter = require("./routers/user");
const meRouter = require("./routers/me");
const uploadRouter = require("./routers/upload");
const PORT = process.env.PORT || config.get("port");
const cors = require("cors");

const app = express();

/**
 * 1. CRUD Brach
 * 2. CRUD car
 * 3. CRUD trip
 * 4. CRUD Station
 * 5. booking ticket
 * 6. Authentication, Authorization
 * 7. Upload file
 * 8. Chat module
 */
app.use(
  cors({
    origin: "http://localhost:5500",
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());

app.use("/img", express.static(path.join(__dirname, "img")));

app.use(tripRouter);

app.use(branchRouter);

app.use(carRouter);

app.use(stationRouter);

app.use(userRouter);

app.use(meRouter);

app.use(uploadRouter);

app.listen(PORT, () => {
  console.log("listening");
});
