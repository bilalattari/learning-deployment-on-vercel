import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import CommentProblem from '../model/CommentProblem.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'duvdqnoht',
    api_key: '538347923483567',
    api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0',
});

// Configure Multer
const upload = multer({ dest: 'uploads/' });

// POST route to create a new comment
router.post('/', upload.single('problemFile'), async (req, res) => {
  try {
    const { student, classWork, description } = req.body;

    let problemFile = '';
    if (req.file) {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      problemFile = result.secure_url;
    }

    const newComment = new CommentProblem({
      student,
      classWork,
      description,
      problemFile
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // GET route to fetch comments for a specific classWork
router.get('/:classWorkId', async (req, res) => {
    try {
      const comments = await CommentProblem.find({ classWork: req.params.classWorkId })
        .populate('student', )
        .sort('-createdAt');
  
      if (!comments) {
        return res.status(404).json({ message: 'No comments found' });
      }

      console.log('comments', comments)
  
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      res.status(400).json({ message: error.message });
    }
  });  

export default router;

