const config = require("config");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const User = require("../models/user");
const Signature = config.get("jwtSignature");
const sgMailAPI = config.get("sgAPIKey");

const createUser = async (req, res) => {
    const { username, password, email, phone } = req.body;
    try {
        const foundedUser = await User.findOne().or({ username }, { email });
        if (foundedUser)
            return res.status(400).send({ message: "user already exist" });

        const newUser = new User({
            username,
            password,
            email,
            phone,
            role: "user",
        });
        let result = await newUser.save();
        result.toObject;
        delete result.password;
        sgMail.setApiKey(sgMailAPI);

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "something went wrong" });
    }
};
const signIn = async (req, res) => {
    const { username, password } = req.body;
    //check username
    const foundedUser = await User.findOne({ username });
    if (!foundedUser) return res.status(401).send("wrong username password");
    //check password
    const isMatch = await bycrypt.compare(password, foundedUser.password);
    if (!isMatch) return res.status(401).send("wrong username password");

    //generate token
    const token = await jwt.sign(
        {
            _id: foundedUser.id,
        },
        Signature
    );

    //save token to db
    foundedUser.tokens.push(token);
    await foundedUser.save();

    res.send(token);
};
const logOut = async (req, res) => {
    const index = req.user.tokens.findIndex((token) => token === req.token);
    req.user.tokens.splice(index, 1);
    await req.user.save();
    res.send();
};
const updateUser = async (req, res) => {
    const { id } = req.query;
    const { oldPassword, newPassword } = req.body;
    try {
        const foundedUser = await User.findById(id);
        if (!foundedUser) return res.status(400).send({ message: "invalid user" });
        const isMatch = await bycrypt.compare(oldPassword, foundedUser.password);
        console.log(isMatch, newPassword, oldPassword, foundedUser.password)
        if (!isMatch) return res.status(400).send({ message: "invalid password" });
        foundedUser.password = newPassword;
        const result = await foundedUser.save();
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" })
    }

}
module.exports = {
    createUser,
    signIn,
    logOut,
    updateUser
};
