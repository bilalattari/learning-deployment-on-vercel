import express from "express";
import Trainer from "../model/Trainer.js";
import Student from "../model/Student.js";
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
    console.log('Received form data:', req.body);
    console.log('Received files:', req.files);

    // Upload image and resume to Cloudinary
    const imageResult = await uploadToCloudinary(req.files['image'][0]);
    const resumeResult = await uploadToCloudinary(req.files['resume'][0]);

    // Parse the Batches and Sections JSON strings
    const batches = JSON.parse(req.body.Batches || '[]');
    const sections = JSON.parse(req.body.Sections || '[]');
    console.log('Parsed batches:', batches);
    console.log('Parsed sections:', sections);

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
      batches: batches,
      sections: sections,
      password: req.body.Password,
      image: imageResult.secure_url,
      resume: resumeResult.secure_url,
    });

    console.log('Trainer object before saving:', newTrainer);

    // Save to the database
    await newTrainer.save();

    res.status(200).json({ message: 'Trainer added successfully', trainer: newTrainer });
  } catch (error) {
    console.error('Error in trainer creation:', error);
    res.status(500).json({ message: 'Failed to upload files or save trainer', error: error.message });
  }
});

// Get All Trainers
// // GET: Fetch Trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate('course', 'title') // Populating course title
      .populate('batches', 'title')  // Populating batch title
      .populate('sections', 'title'); // Populating section title

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

// router.put("/:id", upload.fields([{ name: "image" }, { name: "resume" }]), async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     // Handle image update
//     if (req.files && req.files['image']) {
//       const imageResult = await uploadToCloudinary(req.files['image'][0]);
//       updates.image = imageResult.secure_url;
//     }

//     // Handle resume update
//     if (req.files && req.files['resume']) {
//       const resumeResult = await uploadToCloudinary(req.files['resume'][0]);
//       updates.resume = resumeResult.secure_url;
//     }

//     // Update the trainer in the database
//     const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true });

//     if (!updatedTrainer) return res.status(404).json({ message: "Trainer not found" });
//     res.status(200).json({ message: "Trainer updated successfully", updatedTrainer });
//   } catch (error) {
//     console.error("Error updating trainer:", error);
//     res.status(500).json({ message: "Failed to update trainer.", error: error.message });
//   }
// });


// Delete Trainer

router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle image update
    if (req.files && req.files['image']) {
      const imageResult = await uploadToCloudinary(req.files['image'][0]);
      updates.image = imageResult.secure_url;
    }

    // Handle resume update
    if (req.files && req.files['resume']) {
      const resumeResult = await uploadToCloudinary(req.files['resume'][0]);
      updates.resume = resumeResult.secure_url;
    }

    // Parse arrays
    ['batches', 'sections'].forEach(field => {
      if (updates[field]) {
        updates[field] = Array.isArray(updates[field]) ? updates[field] : [updates[field]];
      }
    });

    // Update the trainer in the database
    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedTrainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json({ message: "Trainer updated successfully", updatedTrainer });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ message: "Failed to update trainer.", error: error.message });
  }
});

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