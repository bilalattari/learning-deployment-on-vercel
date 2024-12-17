import express from "express";
const router = express.Router();
import Batch from "../model/Batch.js";

router.get("/", async (req, res) => {
	const batches = await Batch.find();
	res.status(200).json({
		msg: "courses fetched successfully",
		error: false,
		data: batches,
	});
});

router.post("/", async (req, res) => {
	const { title, description, course } = req.body;
	const newBatch = new Batch({ title, description, course });
	const savedBatch = await newBatch.save();

	res.status(201).json({
		msg: "batch added successfully",
		data: savedBatch,
		error: false,
	});
});

export default router;
