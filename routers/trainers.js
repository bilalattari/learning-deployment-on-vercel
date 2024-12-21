import express from "express";
const router = express.Router();
import Trainer from "../model/Trainer.js";
import Batch from "../model/Batch.js";

router.get("/", async (req, res) => {
	const trainers = await Trainer.find();
	res.status(200).json({
		msg: "trainers fetched successfully",
		error: false,
		data: trainers,
	});
});

// router.get("/:courseId", async (req, res) => {
// 	const { courseId } = req.params;
	
// 	// Check if courseId is a valid MongoDB ObjectId
// 	if (!mongoose.Types.ObjectId.isValid(courseId)) {
// 	  return res.status(400).json({ message: "Invalid courseId format" });
// 	}
  
// 	try {
// 	  console.log(`Fetching batches for course ID: ${courseId}`);
// 	  const batches = await Batch.find({ courseId });
  
// 	  // Check if any batches are found
// 	  if (!batches.length) {
// 		return res.status(404).json({ message: "No batches found for this course" });
// 	  }
  
// 	  res.status(200).json(batches);
// 	} catch (error) {
// 	  console.error('Error fetching batches:', error);
// 	  res.status(500).json({ message: "Error fetching batches" });
// 	}
//   });
  
  
// GET /:courseId: Fetch batches for a specific course
router.get("/:courseId", async (req, res) => {
	const { courseId } = req.params;
  
	// Validate courseId format
	if (!mongoose.Types.ObjectId.isValid(courseId)) {
	  return res.status(400).json({ message: "Invalid courseId format", error: true });
	}
  
	try {
	  console.log(`Fetching batches for course ID: ${courseId}`);
	  const batches = await Batch.find({ courseId });
  
	  if (!batches.length) {
		return res.status(404).json({ message: "No batches found for this course", error: true });
	  }
  
	  res.status(200).json({
		message: "Batches fetched successfully",
		error: false,
		data: batches,
	  });
	} catch (error) {
	  console.error("Error fetching batches:", error);
	  res.status(500).json({ message: "Error fetching batches", error: true });
	}
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
