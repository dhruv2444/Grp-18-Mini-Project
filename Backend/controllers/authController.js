const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // const userData = req.body;
    // const firstName = userData.firstName;
    // const lastName = userData.lastName;
    // const email = userData.email;
    // const password = userData.password;

    const hashedPassword = await bcrypt.hash(String(password), 7);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password:hashedPassword,
    });

    const user = await newUser.save();
    const { password: _password, ...sanitizedUser } = user.toObject();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 2 * 60 * 60 * 1000, // 2h
    });
    res.status(200).json({
      success: true,
      user: sanitizedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(String(password), String(user.password));

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid password",
      });
    }

    
    const { password: _password, ...sanitizedUser } = user.toObject();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 2 * 60 * 60 * 1000, // 2h
    });

    res.status(200).json({
        success:true,
        user:sanitizedUser
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {login,signup}