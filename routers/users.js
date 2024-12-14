import express from "express";
const router = express.Router();
import User from "../model/User.js";

router.get("/", async (req, res) => {
	const users = await User.find();
	res.status(200).json({
		msg: "User fetched successfully",
		error: false,
		data: users,
	});
});

router.post("/", async (req, res) => {
	const { name, email, password, role } = req.body;
	// Create new user
	const newUser = new User({ name, email, password, role });

	// Save to database
	const savedUser = await newUser.save();

	res.status(201).json({
		msg: "User added successfully",
		data: savedUser,
		error: false,
	});
});

export default router;
