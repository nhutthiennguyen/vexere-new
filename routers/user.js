const express = require("express");
const passport = require("passport");
const { createUser, signIn, logOut, updateUser } = require("../controllers/user");
const { auth } = require("../helpers/auth");
const router = express.Router();
const passportStrategy = require("passport-facebook-token");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

const Signature = config.get("jwtSignature");

router.post("/signup", auth(["admin"]), createUser);
router.post("/signin", signIn);
router.post("/logout", auth(), logOut);
router.patch("/update", updateUser);

passport.use("facebookToken", new passportStrategy(
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
));

router.post(
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

module.exports = router;
