// // import express from "express";
// // import Trainer from "../model/Trainer.js";
// // import Assignment from "../model/Assignment.js";
// // import AssignmentSubmission from "../model/AssignmentSubmission.js";
// // import User from "../model/User.js";

// // const router = express.Router();

// // router.get('/:userId', async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     // Find User by ID
// //     const user = await User.findById(userId);
// //     if (!user || user.role !== 'teacher') {
// //       return res.status(403).json({ message: 'User is not a teacher' });
// //     }

// //     // Fetch Trainer Data
// //     const trainer = await Trainer.findOne({ email: user.email });
// //     if (!trainer) {
// //       return res.status(404).json({ message: 'Trainer data not found' });
// //     }

// //     // Fetch assignments for this trainer
// //     const assignments = await Assignment.find({ trainer: trainer._id })
// //       .populate('course', 'title')
// //       .populate('batch', 'title')
// //       .populate('section', 'title');

// //     // Fetch submissions for these assignments
// //     const submissionPromises = assignments.map(async (assignment) => {
// //       const submissions = await AssignmentSubmission.find({ assignment: assignment._id });
// //       return {
// //         assignment: assignment.name,
// //         course: assignment.course.title,
// //         batch: assignment.batch.title,
// //         section: assignment.section.title,
// //         totalSubmissions: submissions.length,
// //         onTimeSubmissions: submissions.filter(sub => new Date(sub.createdAt) <= new Date(assignment.deadline)).length,
// //         lateSubmissions: submissions.filter(sub => new Date(sub.createdAt) > new Date(assignment.deadline)).length,
// //       };
// //     });

// //     const submissionData = await Promise.all(submissionPromises);

// //     // Group data by course, batch, and section
// //     const groupedData = submissionData.reduce((acc, curr) => {
// //       const key = `${curr.course}-${curr.batch}-${curr.section}`;
// //       if (!acc[key]) {
// //         acc[key] = {
// //           course: curr.course,
// //           batch: curr.batch,
// //           section: curr.section,
// //           totalAssignments: 0,
// //           totalSubmissions: 0,
// //           onTimeSubmissions: 0,
// //           lateSubmissions: 0,
// //         };
// //       }
// //       acc[key].totalAssignments += 1;
// //       acc[key].totalSubmissions += curr.totalSubmissions;
// //       acc[key].onTimeSubmissions += curr.onTimeSubmissions;
// //       acc[key].lateSubmissions += curr.lateSubmissions;
// //       return acc;
// //     }, {});

// //     const activityData = Object.values(groupedData);

// //     res.status(200).json(activityData);
// //   } catch (error) {
// //     console.error('Error fetching teaching activity:', error);
// //     res.status(500).json({ error: 'Failed to fetch teaching activity data.' });
// //   }
// // });

// // export default router;



// import express from "express";
// import Trainer from "../model/Trainer.js";
// import Assignment from "../model/Assignment.js";
// import AssignmentSubmission from "../model/AssignmentSubmission.js";
// import User from "../model/User.js";

// const router = express.Router();

// router.get('/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Find User by ID
//     const user = await User.findById(userId);
//     if (!user || user.role !== 'teacher') {
//       return res.status(403).json({ message: 'User is not a teacher' });
//     }

//     // Fetch Trainer Data
//     const trainer = await Trainer.findOne({ email: user.email });
//     if (!trainer) {
//       return res.status(404).json({ message: 'Trainer data not found' });
//     }

//     // Fetch assignments for this trainer
//     const assignments = await Assignment.find({ trainer: trainer._id })
//       .populate('course', 'title')
//       .populate('batch', 'title')
//       .populate('section', 'title');

//     // Fetch submissions for these assignments
//     const submissionPromises = assignments.map(async (assignment) => {
//       const submissions = await AssignmentSubmission.find({ assignment: assignment._id });
//       return {
//         date: assignment.deadline,
//         course: assignment.course.title,
//         batch: assignment.batch.title,
//         section: assignment.section.title,
//         totalSubmissions: submissions.length,
//         onTimeSubmissions: submissions.filter(sub => new Date(sub.createdAt) <= new Date(assignment.deadline)).length,
//         lateSubmissions: submissions.filter(sub => new Date(sub.createdAt) > new Date(assignment.deadline)).length,
//       };
//     });

//     const submissionData = await Promise.all(submissionPromises);

//     // Sort data by date
//     submissionData.sort((a, b) => new Date(a.date) - new Date(b.date));

//     res.status(200).json(submissionData);
//   } catch (error) {
//     console.error('Error fetching teaching activity:', error);
//     res.status(500).json({ error: 'Failed to fetch teaching activity data.' });
//   }
// });

// export default router;



import express from "express";
import Trainer from "../model/Trainer.js";
import Assignment from "../model/Assignment.js";
import AssignmentSubmission from "../model/AssignmentSubmission.js";
import User from "../model/User.js";

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find User by ID
    const user = await User.findById(userId);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'User is not a teacher' });
    }

    // Fetch Trainer Data
    const trainer = await Trainer.findOne({ email: user.email });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer data not found' });
    }

    // Fetch assignments for this trainer
    const assignments = await Assignment.find({ trainer: trainer._id })
      .populate('course', 'title')
      .populate('batch', 'title')
      .populate('section', 'title');

      console.log('assignments', assignments);
      

    // Fetch submissions for these assignments
    const submissionPromises = assignments.map(async (assignment) => {
      const submissions = await AssignmentSubmission.find({ assignment: assignment._id });
      return {
        date: assignment.deadline,
        course: assignment.course.title,
        batch: assignment.batch.title,
        section: assignment.section.title,
        assignmentName: assignment.name,
        totalSubmissions: submissions.length,
        onTimeSubmissions: submissions.filter(sub => new Date(sub.createdAt) <= new Date(assignment.deadline)).length,
        lateSubmissions: submissions.filter(sub => new Date(sub.createdAt) > new Date(assignment.deadline)).length,
      };
    });

    const submissionData = await Promise.all(submissionPromises);

    // Sort data by date
    submissionData.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json(submissionData);
  } catch (error) {
    console.error('Error fetching teaching activity:', error);
    res.status(500).json({ error: 'Failed to fetch teaching activity data.' });
  }
});

export default router;

