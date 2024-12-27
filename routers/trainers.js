// Imports
import express from 'express';
import cloudinary from 'cloudinary';
import Trainer from '../model/Trainer.js';
import multer from 'multer';

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

const upload = multer({ dest: 'uploads/' });

const router = express.Router();



// // Apply middleware to handle file uploads
// router.post(
//   "/",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "resume", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       // DEBUG: Log uploaded files and body
//       console.log("Files:", req.files);
//       console.log("Body:", req.body);

//       // Check if files are uploaded
//       if (!req.files || !req.files.image || !req.files.resume) {
//         return res.status(400).json({ msg: "Image and Resume are required." });
//       }

//       // Cloudinary uploads
//       const imageBuffer = req.files.image[0].buffer.toString("base64");
//       const resumeBuffer = req.files.resume[0].buffer.toString("base64");

//       const imageUpload = await cloudinary.uploader.upload(
//         `data:image/png;base64,${imageBuffer}`,
//         { folder: "trainers/images" }
//       );

//       const resumeUpload = await cloudinary.uploader.upload(
//         `data:application/pdf;base64,${resumeBuffer}`,
//         { folder: "trainers/resumes" }
//       );

//       // Save Trainer to database
//       const newTrainer = new Trainer({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         whatsapp: req.body.whatsapp,
//         cnic: req.body.cnic,
//         salary: req.body.salary,
//         address: req.body.address,
//         specialization: req.body.specialization,
//         course: req.body.course,
//         batch: req.body.batch,
//         section: req.body.section,
//         password: req.body.password,
//         image: imageUpload.secure_url,
//         resume: resumeUpload.secure_url,
//       });

//       const savedTrainer = await newTrainer.save();

//       res.status(201).json({
//         msg: "Trainer added successfully",
//         data: savedTrainer,
//         error: false,
//       });
//     } catch (error) {
//       console.error("Error:", error.message);
//       res.status(500).json({ msg: "Failed to add trainer", error: error.message });
//     }
//   }
// );

// Routes

// router.post("/", async (req, res) => {
//   const {
//     name,
//     email,
//     phone,
//     whatsapp,
//     cnic,
//     salary,
//     specialization,
//     course,
//     batch,
//     section,
//     password,
//     resume,
//     image,
//   } = req.body;

//   try {
//     const uploadedImage = await cloudinary.uploader.upload(image, {
//       folder: 'trainers/images'
//     });

//     const uploadedResume = await cloudinary.uploader.upload(resume, {
//       folder: 'trainers/images'
//     });

//     if (!uploadedImage.secure_url || !uploadedResume.secure_url) {
//       return res.status(400).json({ msg: "Failed to upload image or resume" });
//     }

//     const newTrainer = new Trainer({
//       name,
//       email,
//       phone,
//       whatsapp,
//       cnic,
//       salary,
//       specialization,
//       course,
//       batch,
//       section,
//       password,
//       image: uploadedImage.secure_url,
//       resume: uploadedResume.secure_url
//     });

//     console.log('Uploaded Image URL:', uploadedImage.secure_url);
//     console.log('Uploaded Resume URL:', uploadedResume.secure_url);

//     const savedTrainer = await newTrainer.save();
//     res.status(201).json({
//       msg: "Trainer added successfully",
//       data: savedTrainer,
//       error: false,
//     });

//   } catch (error) {
//     console.error("Error Details:", error); // Log detailed error
//     res.status(500).json({
//       msg: "Failed to add Trainer",
//       error: error.message, // Send error message for debugging
//     });
//   }
// });

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