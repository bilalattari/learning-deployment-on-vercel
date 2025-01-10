// import express from 'express';
// import mongoose from 'mongoose';
// import cloudinary from 'cloudinary';
// import multer from 'multer';
// import Assignment from '../model/Assignment.js';

// const router = express.Router();

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: 'duvdqnoht',
//   api_key: '538347923483567',
//   api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0',
// });

// // Multer Configuration
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
// }).single('file'); // 'file' is the name of the input field for file upload

// // Function to upload file to Cloudinary
// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.v2.uploader.upload_stream(
//       { resource_type: 'auto' },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result.secure_url);
//       }
//     );
//     stream.end(fileBuffer); // Send file buffer to Cloudinary
//   });
// };

// // Upload Assignment Route
// router.post('/upload', upload, async (req, res) => {

//   console.log(req.body);
//   try {
//     const { name, deadline, course, batch, section, trainer, campus } = req.body;

//     let fileUrl = '';
//     if (req.file) {
//       // Upload file to Cloudinary
//       fileUrl = await uploadToCloudinary(req.file.buffer);
//     }

//     // Create and save assignment
//     const newAssignment = new Assignment({
//       name,
//       deadline,
//       file: fileUrl,
//       course,
//       batch,
//       section,
//       trainer,
//       campus,
//     });

//     await newAssignment.save();
//     return res.status(201).json({ message: 'Assignment uploaded successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error processing request', error });
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     // Database se saare assignments fetch karo
//     // Fetch assignments with populated fields
//     const assignments = await Assignment.find()
//       .populate({ path: 'campus', select: 'title' })
//       .populate({ path: 'trainer', select: 'name' })
//       .populate({ path: 'course', select: 'title' })
//       .populate({ path: 'batch', select: 'title' })
//       .populate({ path: 'section', select: 'title' });
//     // Response bhejo
//     return res.status(200).json(assignments);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error fetching assignments', error });
//   }
// });


// export default router;











import express from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import multer from 'multer';
import Assignment from '../model/Assignment.js';
import Course from '../model/Course.js';
import Section from '../model/Section.js';
import Trainer from '../model/Trainer.js';
import fs from "fs";

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
}).single('file');

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
    stream.end(fileBuffer);
  });
};

// Upload Assignment Route
router.post('/upload', upload, async (req, res) => {
  try {
    const { name, deadline, course, batch, section, trainer, campus, link } = req.body;

    // Validate required fields
    if (!name || !deadline || !course || !batch || !section || !trainer || !campus) {
      return res.status(400).json({ message: 'All fields are required except file or link' });
    }

    let fileUrl = '';
    if (req.file) {
      fileUrl = await uploadToCloudinary(req.file.buffer);
    } else if (!link) {
      return res.status(400).json({ message: 'Either a file or a link must be provided' });
    }

    // Find the course by name
    const courseDoc = await Course.findOne({ title: course });
    if (!courseDoc) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Find the section by name
    const sectionDoc = await Section.findOne({ title: section });
    if (!sectionDoc) {
      return res.status(400).json({ message: 'Section not found' });
    }

    fs.unlinkSync(req.file.path);

    // Create and save assignment
    const newAssignment = new Assignment({
      name,
      deadline: new Date(deadline),
      file: fileUrl,
      link,
      course: courseDoc._id,
      batch,
      section: sectionDoc._id,
      trainer,
      campus,
    });

    console.log('new Assignment', newAssignment);

    await newAssignment.save();
    return res.status(201).json({ message: 'Assignment uploaded successfully', assignment: newAssignment });
  } catch (error) {
    console.error('Error in assignment upload:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }
    return res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

// router.get('/', async (req, res) => {
//   try {
//     const assignments = await Assignment.find()
//       .populate('campus', 'title')
//       .populate('trainer', 'name')
//       .populate('course', 'title')
//       .populate('batch', 'title')
//       .populate('section', 'title')
//       .sort({ createdAt: -1 }); // Sort by creation date, newest first

//     return res.status(200).json(assignments);
//   } catch (error) {
//     console.error('Error fetching assignments:', error);
//     return res.status(500).json({ message: 'Error fetching assignments', error: error.message });
//   }
// });

// In your assignments.js router file

router.get('/', async (req, res) => {
  try {
    const { trainer } = req.query;
    let query = {};

    if (trainer) {
      query.trainer = trainer;
    }

    const assignments = await Assignment.find(query)
      .populate('campus', 'title')
      .populate('trainer', 'name')
      .populate('course', 'title')
      .populate('batch', 'title')
      .populate('section', 'title')
      .sort({ createdAt: -1 });

    return res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

export default router;