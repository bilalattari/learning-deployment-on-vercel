import express from 'express';
import AssignmentSubmission from '../model/AssignmentSubmission.js';
import fs from "fs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Assignment from '../model/Assignment.js';
import Student from '../model/Student.js';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'duvdqnoht',
    api_key: '538347923483567',
    api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0'
});

// Submit Assignment
router.post('/submit', upload.single('file'), async (req, res) => {
    try {
        console.log('Received submission request:', req.body);
        console.log('Received file:', req.file);
        const { assignmentId, studentId, codeLink, deploymentLink, videoLink } = req.body;
        
        const assignment = await Assignment.findById(assignmentId);
        const student = await Student.findById(studentId);

        if (!assignment || !student) {
            return res.status(404).json({ error: 'Assignment or Student not found' });
        }

        // Check if the student has already submitted this assignment
        const existingSubmission = await AssignmentSubmission.findOne({
            assignment: assignmentId,
            student: studentId
        });

        if (existingSubmission) {
            return res.status(400).json({ error: 'You have already submitted this assignment' });
        }

        let fileUrl = null;
        if (req.file) {
            // Upload file to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: `post_${Date.now()}`,
                folder: "Assignment_Submission",
            });
            fileUrl = uploadResult.secure_url;

            // Delete local file
            fs.unlinkSync(req.file.path);
        }

        const submission = new AssignmentSubmission({
            assignment: assignmentId,
            student: studentId,
            file: fileUrl,
            codeLink,
            deploymentLink,
            videoLink,
        });

        await submission.save();

        console.log('Assignment submission saved:', submission);

        // Update student with the submitted assignment
        student.assignments.push(submission._id);
        await student.save();

        res.status(201).json({ message: 'Assignment submitted successfully', submission });
    } catch (error) {
        console.error('Error in assignment submission:', error);
        res.status(500).json({ error: 'Failed to submit assignment', details: error.message });
    }
});

// Get student's submission for a specific assignment
router.get('/student-submission/:assignmentId/:studentId', async (req, res) => {
    try {
        const { assignmentId, studentId } = req.params;
        const submission = await AssignmentSubmission.findOne({
            assignment: assignmentId,
            student: studentId
        });
        res.json(submission);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch submission' });
    }
});

// Update submission
router.put('/update/:submissionId', upload.single('file'), async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { codeLink, deploymentLink, videoLink } = req.body;

        const submission = await AssignmentSubmission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        // Check if the assignment deadline has passed
        const assignment = await Assignment.findById(submission.assignment);
        if (new Date() > new Date(assignment.deadline)) {
            return res.status(400).json({ error: 'Assignment deadline has passed. You cannot edit your submission.' });
        }

        let fileUrl = submission.file;
        if (req.file) {
            // Upload new file to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: `post_${Date.now()}`,
                folder: "Assignment_Submission",
            });
            fileUrl = uploadResult.secure_url;

            // Delete local file
            fs.unlinkSync(req.file.path);
        }

        submission.file = fileUrl;
        submission.codeLink = codeLink || submission.codeLink;
        submission.deploymentLink = deploymentLink || submission.deploymentLink;
        submission.videoLink = videoLink || submission.videoLink;

        await submission.save();

        res.json({ message: 'Submission updated successfully', submission });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update submission' });
    }
});

// Delete submission
router.delete('/delete/:submissionId', async (req, res) => {
    try {
        const { submissionId } = req.params;
        const submission = await AssignmentSubmission.findById(submissionId);
        
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        // Check if the assignment deadline has passed
        const assignment = await Assignment.findById(submission.assignment);
        if (new Date() > new Date(assignment.deadline)) {
            return res.status(400).json({ error: 'Assignment deadline has passed. You cannot delete your submission.' });
        }

        // Remove the submission from the student's assignments array
        await Student.findByIdAndUpdate(submission.student, {
            $pull: { assignments: submissionId }
        });

        await AssignmentSubmission.findByIdAndDelete(submissionId);

        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete submission' });
    }
});

export default router;

