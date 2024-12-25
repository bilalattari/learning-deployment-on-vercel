//controllers/authControllers.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/User.js";

dotenv.config();

export const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    console.log('JWT Secret:', process.env.JWT_SECRET);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ msg: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
