const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = (roles) => async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, "vexerejwt");
    const allowRoles = roles || ["admin", "user"];
    const foundedUser = await User.findOne({
      _id: decoded._id,
      tokens: token,
      role: { $in: allowRoles },
    });
    console.log(foundedUser);
    if (!foundedUser)
      return res.status(401).send({ message: "you are not authorization" });
    req.user = foundedUser;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "you are not authorizationn" });
  }
};

module.exports = {
  auth,
};
