import express from "express";
const router = express.Router();
import Trainer from "../model/Trainer.js";

router.get("/", async (req, res) => {
	const trainers = await Trainer.find();
	res.status(200).json({
		msg: "trainers fetched successfully",
		error: false,
		data: trainers,
	});
});

router.post("/", async (req, res) => {
	const { name, email, role, salary, field, timing, course, batch } = req.body;
	// Create new user
	const newTrainer = new Trainer({
		name,
		email,
		role,
		salary,
		field,
		timing,
		course,
		batch,
	});

	// Save to database
	const savedTrainer = await newTrainer.save();

	res.status(201).json({
		msg: "Trainer added successfully",
		data: savedTrainer,
		error: false,
	});
});

export default router;
