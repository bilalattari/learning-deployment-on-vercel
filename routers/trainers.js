// // Imports
// import express from 'express';
// import cloudinary from 'cloudinary';
// import Trainer from '../model/Trainer.js';

// // Cloudinary Configuration
// // cloudinary.v2.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET
// // });

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: 'duvdqnoht',
//   api_key: '538347923483567',
//   api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0'
// });

// const router = express.Router();

// // Routes

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



// // GET: Fetch Trainers
// router.get('/', async (req, res) => {
//   try {
//     const trainers = await Trainer.find()
//       .populate('course', 'title') // Populating course title
//       .populate('batch', 'title')  // Populating batch title
//       .populate('section', 'title'); // Populating section title

//     res.status(200).json({ data: trainers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch trainers' });
//   }
// });

// // Export Module
// export default router;



import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import bcrypt from 'bcryptjs';
import Trainer from '../model/Trainer.js';

const router = express.Router();

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'trainers',
    format: async (req, file) => 'png', // supports png format
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

// Create Trainer
// router.post('/', upload.fields([{ name: 'image' }, { name: 'resume' }]), async (req, res) => {

//   console.log('Request Body:', req.body);
//   console.log('Request File:', req.file);
//   console.log('Password:', req.body.password);


//   try {
//     const {
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
//       password
//     } = req.body;

//     // const hashedPassword = await bcrypt.hash(password, 10);
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     const imageUrl = req.files['image'] ? req.files['image'][0].path : '';
//     const resumeUrl = req.files['resume'] ? req.files['resume'][0].path : '';

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
//       password: hashedPassword,
//       image: imageUrl,
//       resume: resumeUrl,
//     });

//     await newTrainer.save();

//     res.status(201).json({ message: 'Trainer added successfully', data: newTrainer });
//   } catch (error) {
//     console.error('Error adding trainer:', error);
//     res.status(500).json({ message: 'Failed to add trainer', error: error.message });
//   }
// });

router.post('/', upload.fields([{ name: 'image' }, { name: 'resume' }]), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  console.log('Password:', req.body.password);

  try {
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
      password
    } = req.body;

    // Ensure the password exists
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imageUrl = req.files['image'] ? req.files['image'][0].path : '';
    const resumeUrl = req.files['resume'] ? req.files['resume'][0].path : '';

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
      password: hashedPassword,
      image: imageUrl,
      resume: resumeUrl,
    });

    await newTrainer.save();

    res.status(201).json({ message: 'Trainer added successfully', data: newTrainer });
  } catch (error) {
    console.error('Error adding trainer:', error);
    res.status(500).json({ message: 'Failed to add trainer', error: error.message });
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

// Update Trainer
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'resume' }]), async (req, res) => {
  try {
    const updates = req.body;

    if (req.files['image']) {
      updates.image = req.files['image'][0].path;
    }

    if (req.files['resume']) {
      updates.resume = req.files['resume'][0].path;
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ message: 'Trainer updated successfully', data: updatedTrainer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update trainer', error: error.message });
  }
});

// Delete Trainer
router.delete('/:id', async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete trainer', error: error.message });
  }
});

export default router;
