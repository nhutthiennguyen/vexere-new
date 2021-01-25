require("./db/connect");
const config = require("config");
const express = require("express");
const path = require("path"); // package to build url staticp
const bodyParser = require("body-parser");
const tripRouter = require("./routers/trip");
const branchRouter = require("./routers/branch");
const carRouter = require("./routers/car");
const stationRouter = require("./routers/station");
const userRouter = require("./routers/user");
const meRouter = require("./routers/me");
const uploadRouter = require("./routers/upload");
const passport = require("passport");
const passportStrategy = require("passport-facebook-token");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || config.get("port");
const cors = require("cors");

const Signature = config.get("jwtSignature");

const app = express();

passport.use(
  "facebookToken",
  new passportStrategy(
    {
      clientID: "319865169414664",
      clientSecret: "24150872156d0cddefe9c9893b2bd1d6",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userEmail = profile.emails[0].value;
      const userAvatar = profile.photos[0].value;
      const foundedUser = await User.findOne({ email: userEmail });
      let user = foundedUser;
      if (!foundedUser) {
        const newUser = new User({
          email: userEmail,
          role: "user",
          avatar: userAvatar,
        });
        user = await newUser.save();
      }
      done(null, user);
    }
  )
);

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

app.post(
  "/login/facebook",
  passport.authenticate("facebookToken", { session: false }),

  async (req, res) => {
    const token = await jwt.sign(
      {
        _id: req.user._id,
      },
      Signature
    );

    //save token to db
    req.user.tokens.push(token);
    await req.user.save();

    res.send(token);
  }
);

app.listen(PORT, () => {
  console.log("listening");
});
