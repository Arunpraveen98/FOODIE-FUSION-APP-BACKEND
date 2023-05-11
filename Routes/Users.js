const express = require("express");
const router = express.Router();
const User = require("../Models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authorize } = require("../Authorize");
// ---------------------------
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// --------------------------
router.post("/register", async (req, res) => {
  // -------------
  const { name, email, password } = req.body;
  // -------------
  try {
    const CheckEmail = await User.findOne({ email: email });
    if (!CheckEmail) {
      if (email === "admin@gmail.com") {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const adminuser = new User({
          name,
          email,
          password: hash,
          isAdmin: true,
        });
        await adminuser.save();
      } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hash });
        await newUser.save();
      }
      // newUser.save();
      res.status(201).json({ message: "👍successfully User Registered" });
    } else {
      if (CheckEmail.email === email) {
        res.status(401).json({ message: "❗Email already registered" });
      }
    }

    // -------------
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "❗Internal Server Error" });
  }
});
// --------------------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // -------------
  try {
    // -------------
    const user = await User.findOne({ email });
    console.log(user);
    // -------------
    if (!user) {
      res.status(401).json({ message: "❗Please Signup and Login." });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);
      if (isPasswordValid) {
        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_TIME_OUT,
        });

        const currentUser = {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          _id: user._id,
          user_token: token,
        };
        res
          .status(200)
          .json({ message: "👍Successfully User Logged-in", currentUser });
      } else {
        res.status(422).json({
          message: "❗Incorrect Username/Password",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "❗Internal Server Error" });
    console.log(error);
  }
  // -------------
});

// --------------------------
router.get("/getallusers", authorize, async (req, res) => {
  try {
    // -------------
    const users = await User.find({});
    res.send(users);
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
router.post("/deleteuser", authorize, async (req, res) => {
  // -------------
  const userid = req.body.userid;
  // -------------
  try {
    // -------------
    await User.findOneAndDelete({ _id: userid });
    res.send("User Deleted Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
module.exports = router;
// --------------------------
