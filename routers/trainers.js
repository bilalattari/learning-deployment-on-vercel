import express from "express";
import Trainer from "../model/Trainer.js";
import multer from "multer";
import cloudinary from 'cloudinary';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'duvdqnoht',
  api_key: '538347923483567',
  api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0'
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary upload function for images and resume
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) reject(error);
      resolve(result);
    }).end(file.buffer);
  });
};


// Add Trainer (POST)
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  try {
    // Upload image and resume to Cloudinary
    const imageResult = await uploadToCloudinary(req.files['image'][0]);
    const resumeResult = await uploadToCloudinary(req.files['resume'][0]);

    // Create a new trainer
    const newTrainer = new Trainer({
      name: req.body.Name,
      email: req.body.Email,
      phone: req.body.Phone,
      whatsapp: req.body.Whatsapp,
      cnic: req.body.Cnic,
      salary: req.body.Salary,
      address: req.body.address,
      specialization: req.body.Specialization,
      course: req.body.Course,
      batch: req.body.Batch,
      section: req.body.Section,
      password: req.body.Password,
      image: imageResult.secure_url,
      resume: resumeResult.secure_url,
    });

    // Save to the database
    await newTrainer.save();

    res.status(200).json({ message: 'Trainer added successfully', trainer: newTrainer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload files or save trainer', error: error.message });
  }
});


// Get All Trainers
// // GET: Fetch Trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate('course', 'title') // Populating course title
      .populate('batch', 'title')  // Populating batch title
      .populate('section', 'title'); // Populating section title

    res.status(200).json({ data: trainers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch trainers' });
  }
});

// Get Trainer by ID
router.get("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate("course")
      .populate("batch")
      .populate("section");
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json(trainer);
  } catch (error) {
    console.error("Error fetching trainer:", error);
    res.status(500).json({ message: "Failed to fetch trainer." });
  }
});

// Update Trainer
router.put("/:id", upload.fields([{ name: "image" }, { name: "resume" }]), async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle image update
    if (req.files['image']) {
      const imageResult = await uploadToCloudinary(req.files['image'][0]);
      updates.image = imageResult.secure_url;
    }

    // Handle resume update
    if (req.files['resume']) {
      const resumeResult = await uploadToCloudinary(req.files['resume'][0]);
      updates.resume = resumeResult.secure_url;
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedTrainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json({ message: "Trainer updated successfully", updatedTrainer });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ message: "Failed to update trainer." });
  }
});

// Delete Trainer
router.delete("/:id", async (req, res) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!deletedTrainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ message: "Failed to delete trainer." });
  }
});

export default router;






