import express from 'express';
import mongoose from 'mongoose';
import ClassWork from '../model/ClassWork.js';
import User from '../model/User.js'
import Student from '../model/Student.js';
import Section from '../model/Section.js';

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
    // console.log('Fetching class works for trainer:', trainer)

    const classWorks = await ClassWork.find({ trainer })
      .populate('batch', 'title')
      .populate('campus', 'title')
      .populate('trainer', 'name')
      .sort({ createdAt: -1 })

    res.status(200).json(classWorks)
  } catch (error) {
    console.error('Error fetching class works:', error)
    res.status(500).json({ message: error.message })
  }

});

// New route to fetch class works for a student
router.get('/student-class-works/:userId', async (req, res) => {
  try {
    console.log('Fetching class works for userId:', req.params.userId);
    
    const user = await User.findById(req.params.userId);
    // console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ message: 'User is not a student' });
    }

    const student = await Student.findOne({ email: user.email });
    // console.log('Found student:', student);

    if (!student) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    // Get the section title from the student's section
    const studentSection = await Section.findById(student.section);
    // console.log('Student section:', studentSection);

    if (!studentSection) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Find class works by section title
    const classWorks = await ClassWork.find({ 
      section: studentSection.title // Match by section title instead of ID
    })
    .populate('batch', 'title')
    .populate('campus', 'title')
    .populate('trainer', 'name')
    .populate('course', 'title')
    .sort({ createdAt: -1 });

    // console.log('Found class works:', classWorks);
    res.status(200).json(classWorks);
  } catch (error) {
    console.error('Error fetching class works:', error);
    res.status(500).json({ message: error.message });
  }
});


export default router;

