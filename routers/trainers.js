// Imports
import express from 'express';
import cloudinary from 'cloudinary';
import Trainer from '../model/Trainer.js';

// Cloudinary Configuration
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'duvdqnoht',
  api_key: '538347923483567',
  api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0'
});

const router = express.Router();

// Routes

router.post("/", async (req, res) => {
  const {
    name,
    email,
    phone,
    whatsapp,
    cnic,
    salary,
    specialization,
    course,
    batch,
    section,
    password,
    resume,
    image,
  } = req.body;

  try {
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: 'trainers/images'
    });

    const uploadedResume = await cloudinary.uploader.upload(resume, {
      folder: 'trainers/images'
    });

    if (!uploadedImage.secure_url || !uploadedResume.secure_url) {
      return res.status(400).json({ msg: "Failed to upload image or resume" });
    }

    const newTrainer = new Trainer({
      name,
      email,
      phone,
      whatsapp,
      cnic,
      salary,
      specialization,
      course,
      batch,
      section,
      password,
      image: uploadedImage.secure_url,
      resume: uploadedResume.secure_url
    });

    console.log('Uploaded Image URL:', uploadedImage.secure_url);
    console.log('Uploaded Resume URL:', uploadedResume.secure_url);

    const savedTrainer = await newTrainer.save();
    res.status(201).json({
      msg: "Trainer added successfully",
      data: savedTrainer,
      error: false,
    });

  } catch (error) {
    console.error("Error Details:", error); // Log detailed error
    res.status(500).json({
      msg: "Failed to add Trainer",
      error: error.message, // Send error message for debugging
    });
  }
});

// GET: Fetch Trainers
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

// Export Module
export default router;


