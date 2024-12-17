import express from "express";
const router = express.Router();
import Course from "../model/Course.js";

router.get("/", async (req, res) => {
	const courses = await Course.find();
	res.status(200).json({
		msg: "courses fetched successfully",
		error: false,
		data: courses,
	});
});

router.post("/", async (req, res) => {
	const { title, description, duration } = req.body;
	const newCourse = new Course({ title, description, duration });
	const savedCourse = await newCourse.save();

	res.status(201).json({
		msg: "course added successfully",
		data: savedCourse,
		error: false,
	});
});

export default router;
