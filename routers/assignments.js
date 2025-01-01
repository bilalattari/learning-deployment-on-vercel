import express from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import multer from 'multer';
import Assignment from '../model/Assignment.js';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'duvdqnoht',
  api_key: '538347923483567',
  api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0',
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
}).single('file'); // 'file' is the name of the input field for file upload

// Function to upload file to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer); // Send file buffer to Cloudinary
  });
};

// Upload Assignment Route
router.post('/upload', upload, async (req, res) => {
  try {
    const { name, deadline, course, batch, section, trainer, campus } = req.body;

    let fileUrl = '';
    if (req.file) {
      // Upload file to Cloudinary
      fileUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Create and save assignment
    const newAssignment = new Assignment({
      name,
      deadline,
      file: fileUrl,
      course,
      batch,
      section,
      trainer,
      campus,
    });

    await newAssignment.save();
    return res.status(201).json({ message: 'Assignment uploaded successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing request', error });
  }
});

router.get('/', async (req, res) => {
    try {
      // Database se saare assignments fetch karo
    // Fetch assignments with populated fields
    const assignments = await Assignment.find()
      .populate({ path: 'campus', select: 'title' })
      .populate({ path: 'trainer', select: 'name' })
      .populate({ path: 'course', select: 'title' })
      .populate({ path: 'batch', select: 'title' })
      .populate({ path: 'section', select: 'title' });      
      // Response bhejo
      return res.status(200).json(assignments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching assignments', error });
    }
  });
  

export default router;
