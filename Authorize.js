const JWT = require("jsonwebtoken");
require("dotenv").config();
// ---------------------------
const authorize = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const verify = JWT.verify(
        req.headers.authorization,
        process.env.JWT_SECRET_KEY
      );
      // ---------------------------
      console.log("authorize----", verify);
      if (verify) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
      // ---------------------------
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized", error });
  }
};
// ---------------------------
module.exports = { authorize };
// ---------------------------
