const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, "User-Token");

    const user = decodeToken;

    req.user = user;

    next();
  } catch (err) {
    res.status(401).send({ message: "User isn't authenticated", err });
  }
};
