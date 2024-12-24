// // // import express from "express";
// // // import mongoose from "mongoose";
// // // const router = express.Router();
// // // import Trainer from "../model/Trainer.js";
// // // import Batch from "../model/Batch.js";

// // // // Fetch all trainers
// // // router.get("/", async (req, res) => {
// // //   try {
// // //     const trainers = await Trainer.find();
// // //     res.status(200).json({
// // //       msg: "trainers fetched successfully",
// // //       error: false,
// // //       data: trainers,
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({
// // //       msg: "Failed to fetch trainers",
// // //       error: true,
// // //     });
// // //   }
// // // });

// // // // Fetch batches for a specific course

// // // // router.get('/batches/:id', async (req, res) => {
// // // // 	try {
// // // // 	  const batches = await Batch.find({ courseId: req.params.id });
// // // // 	  if (!batches) {
// // // // 		return res.status(404).send('Batches not found');
// // // // 	  }
// // // // 	  res.status(200).json(batches);
// // // // 	} catch (error) {
// // // // 	  res.status(500).json({ message: 'Error fetching batches', error });
// // // // 	}
// // // //   });


// // // // Add a new trainer
// // // router.post("/", async (req, res) => {
// // //   const { name, email, role, salary, field, timing, course, batch } = req.body;

// // //   // Create new trainer object
// // //   const newTrainer = new Trainer({
// // //     name,
// // //     email,
// // //     role,
// // //     salary,
// // //     field,
// // //     timing,
// // //     course,
// // //     batch,
// // //   });

// // //   try {
// // //     // Save the new trainer to the database
// // //     const savedTrainer = await newTrainer.save();

// // //     res.status(201).json({
// // //       msg: "Trainer added successfully",
// // //       data: savedTrainer,
// // //       error: false,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error adding trainer:", error);
// // //     res.status(500).json({
// // //       msg: "Error adding trainer",
// // //       error: true,
// // //     });
// // //   }
// // // });

// // // export default router;







// // import express from "express";
// // import mongoose from "mongoose";
// // import cloudinary from "cloudinary";
// // import multer from "multer";
// // import Trainer from "../model/Trainer.js";

// // // Cloudinary configuration
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// // 	api_key: process.env.CLOUDINARY_API_KEY,
// // 	api_secret: process.env.CLOUDINARY_API_KEY,
// // });

// // // Multer configuration
// // const upload = multer({ dest: 'uploads/' });

// // const router = express.Router();

// // // Fetch all trainers
// // router.get("/", async (req, res) => {
// //   try {
// //     const trainers = await Trainer.find();
// //     res.status(200).json({
// //       msg: "trainers fetched successfully",
// //       error: false,
// //       data: trainers,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       msg: "Failed to fetch trainers",
// //       error: true,
// //     });
// //   }
// // });

// // // // POST request to add a new trainer
// // // router.post("/", upload.fields([{ name: 'image' }, { name: 'resume' }]), async (req, res) => {
// // //   const { name, email, course, batch, section, password, cnic } = req.body;

// // //   // Upload image and resume to Cloudinary
// // //   try {
// // //     const imageResult = await cloudinary.v2.uploader.upload(req.files.image[0].path);
// // //     const resumeResult = await cloudinary.v2.uploader.upload(req.files.resume[0].path);

// // //     // Create new trainer object
// // //     const newTrainer = new Trainer({
// // //       name,
// // //       email,
// // //       role: 'trainer',
// // //       salary: 0, // You can adjust the salary value accordingly
// // //       field: '', // You can add the field value if needed
// // //       timing: '', // Add timing if needed
// // //       course,
// // //       batch,
// // //       section,
// // //       password,
// // //       image: imageResult.secure_url, // Save the image URL from Cloudinary
// // //       resume: resumeResult.secure_url, // Save the resume URL from Cloudinary
// // //     });

// // //     // Save the trainer to the database
// // //     const savedTrainer = await newTrainer.save();

// // //     res.status(201).json({
// // //       msg: "Trainer added successfully",
// // //       data: savedTrainer,
// // //       error: false,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error adding trainer:", error);
// // //     res.status(500).json({
// // //       msg: "Error adding trainer",
// // //       error: true,
// // //     });
// // //   }
// // // });
// // // Assuming the 'upload' is already set up for handling image and resume uploads
// // router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
// //   const { name, email, phone, password, course, batch, section , salary , spacalization } = req.body;

// //   // Ensure both image and resume are present
// //   if (!req.files || !req.files.image || !req.files.resume) {
// //     return res.status(400).send({ error: 'Both image and resume are required' });
// //   }

// //   const imageUrl = req.files.image[0].path; // The local path of the image file
// //   const resumeUrl = req.files.resume[0].path; // The local path of the resume file

// //   // Create a new trainer document
// //   const newTrainer = new Trainer({
// //     name,
// //     email,
// //     phone,
// //     password,
// //     salary,
// //     spacalization,
// //     course,
// //     batch,
// //     section,
// //     imageUrl,
// //     resumeUrl,
// //   });

// //   try {
// //     // Save the trainer to the database
// //     const savedTrainer = await newTrainer.save();

// //     // Send the saved trainer as a response
// //     res.status(201).send(savedTrainer);
// //   } catch (error) {
// //     console.log("Error saving trainer:", error);
// //     res.status(500).send({ error: 'There was an error saving the trainer' });
// //   }
// // });


// // export default router;



// import express from "express";
// import mongoose from "mongoose";
// import cloudinary from "cloudinary";
// import multer from "multer";
// import Trainer from "../model/Trainer.js";

// const router = express.Router();

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_KEY,
// });

// // Multer configuration
// const upload = multer({ dest: 'uploads/' });

// // Post request for adding a trainer
// router.post('/', upload.fields([{ name: 'Image' }, { name: 'Resume' }]), async (req, res) => {
//   try {
//     const { 
//       Name, 
//       Email, 
//       Phone, 
//       Whatsapp, 
//       Cnic, 
//       Salary, 
//       Specialization, 
//       Course, 
//       Batch, 
//       Section, 
//       Password 
//     } = req.body;

//     let imageUrl = '';
//     let resumeUrl = '';

//     // Check if the image and resume files exist and upload to Cloudinary
//     if (req.files['Image']) {
//       const imageResult = await cloudinary.uploader.upload(req.files['Image'][0].path, {
//         folder: 'trainers/images'
//       });
//       imageUrl = imageResult.secure_url;
//     }

//     if (req.files['Resume']) {
//       const resumeResult = await cloudinary.uploader.upload(req.files['Resume'][0].path, {
//         folder: 'trainers/resumes',
//         resource_type: 'raw', // For PDF files
//       });
//       resumeUrl = resumeResult.secure_url;
//     }

//     // Create Trainer Document
//     const newTrainer = new Trainer({
//       Name,
//       Email,
//       Phone,
//       Whatsapp,
//       Cnic,
//       Salary,
//       Specialization,
//       Course,
//       Batch,
//       Section,
//       Password,
//       Image: imageUrl,
//       Resume: resumeUrl,
//     });

//     // Save to Database
//     await newTrainer.save();

//     res.status(201).json({ message: 'Trainer added successfully!', trainer: newTrainer });
//   } catch (error) {
//     console.error('Error adding trainer:', error);
//     res.status(500).json({ error: 'Failed to add trainer.' });
//   }
// });

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

// export default router;




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
    Name,
    Email,
    Phone,
    Whatsapp,
    Cnic,
    Salary,
    Specialization,
    Course,
    Batch,
    Section,
    Password,
    Resume,
    Image,
  } = req.body;

	try {
		const uploadedImage = await cloudinary.uploader.upload(Image, {
      folder: 'trainers/images'
		});

    const uploadedResume = await cloudinary.uploader.upload(Resume, {
      folder: 'trainers/images'
		});

		const newTrainer = new Trainer({
      Name,
      Email,
      Phone,
      Whatsapp,
      Cnic,
      Salary,
      Specialization,
      Course,
      Batch,
      Section,
      Password,
      Image: uploadedImage.secure_url,
      Resume: uploadedResume.secure_url
		});

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

// // DELETE: Remove Trainer
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const trainer = await Trainer.findById(id);
//     if (!trainer) {
//       return res.status(404).json({ success: false, message: 'Trainer not found' });
//     }

//     // Remove files from Cloudinary
//     const imagePublicId = trainer.Image.split('/').pop().split('.')[0];
//     const resumePublicId = trainer.Resume.split('/').pop().split('.')[0];

//     await cloudinary.v2.uploader.destroy(`trainers/images/${imagePublicId}`);
//     await cloudinary.v2.uploader.destroy(`trainers/resumes/${resumePublicId}`, { resource_type: 'raw' });

//     // Remove from Database
//     await Trainer.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: 'Trainer deleted successfully!' });
//   } catch (error) {
//     console.error('Error deleting trainer:', error);
//     res.status(500).json({ success: false, message: 'Failed to delete trainer.' });
//   }
// });

// Export Module
export default router;
