import express from 'express';
import mongoose from 'mongoose';
import ClassWork from '../model/ClassWork.js';

const router = express.Router();

router.post('/submit-class-work', async (req, res) => {
    console.log('Body Request', req.body);
    try {
        const { title, description, youtubeLink, githubLink, course, batch, section, campus, trainer } = req.body;

        const newClassWork = new ClassWork({
            title,
            description,
            youtubeLink,
            githubLink,
            course,
            batch,
            section,
            campus,
            trainer
        });

        const savedClassWork = await newClassWork.save();

        console.log('savedClassWork', savedClassWork);

        res.status(201).json(savedClassWork);
    } catch (error) {
        console.error('error', error);
        res.status(400).json({ message: error.message });
    }
})

router.get('/get-class-works', async (req, res) => {
    try {
        const { trainer } = req.query
        console.log('Fetching class works for trainer:', trainer)
        
        const classWorks = await ClassWork.find({ trainer })
          .populate('batch', 'title')
          .populate('campus', 'title')
          .populate('trainer', 'name')
          .sort({ createdAt: -1 })
        
        console.log('Found class works:', classWorks.length)
        res.status(200).json(classWorks)
      } catch (error) {
        console.error('Error fetching class works:', error)
        res.status(500).json({ message: error.message })
      }
    
});

export default router;

