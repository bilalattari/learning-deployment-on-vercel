// import express from 'express';
// import Student from '../model/Student.js';
// import nodemailer from 'nodemailer';
// import TeacherAnnouncement from '../model/TeacherAnnouncement.js';

// const router = express.Router();

// // Create a transporter for sending emails
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // You can use your preferred email service
//     auth: {
//         user: 'shoaibrazamemon170@gmail.com', // Replace with your email
//         pass: 'dbze dxhh lgms kzmj' // Replace with your password or app password
//     }
// });

// // Routes
// router.post('/add', async (req, res) => {
//     try {
//         const { title, description, course, batch, section, trainer, campus } = req.body;

//         // Create a new Personal Announcement
//         const teacherAnnouncement = new TeacherAnnouncement({
//             title,
//             description,
//             campus,
//             course,
//             batch,
//             section,
//             trainer,
//         });

//         // Save the personal announcement
//         const savedTeacherAnnouncement = await teacherAnnouncement.save();

//         // Find all students in the selected section
//         const studentsInSection = await Student.find({ section });

//         // Prepare email content
//         const emailSubject = `New Announcement: ${title}`;
//         const emailBody = `
//             <h3>${title}</h3>
//             <p>${description}</p>
//         `;

//         // Loop through students and send emails
//         studentsInSection.forEach(student => {
//             const mailOptions = {
//                 from: 'shoaibrazamemon170@gmail.com',  // Sender's email
//                 to: student.email,             // Student's email
//                 subject: emailSubject,         // Subject line
//                 html: emailBody                // HTML content
//             };

//             // Send email
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log(`Error sending email to ${student.email}:`, error);
//                 } else {
//                     console.log(`Email sent to ${student.email}: ${info.response}`);
//                 }
//             });
//         });

//         // Send the response with the saved announcement
//         res.status(201).json(savedTeacherAnnouncement);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err.message });
//     }
// });

// // // Routes
// // router.get('/', async (req, res) => {
// //     try {
// //         const announcements = await PersonalAnnouncement.find()
// //             .populate({ path: 'campus', select: 'title' })
// //             .populate({ path: 'trainer', select: 'name' })
// //             .populate({ path: 'course', select: 'title' })
// //             .populate({ path: 'batch', select: 'title' })
// //             .populate({ path: 'section', select: 'title' });
// //         res.status(200).json(announcements);
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // }
// // );

// export default router;

import express from 'express';
import TeacherAnnouncement from '../model/TeacherAnnouncement.js';
import Student from '../model/Student.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
router.post('/add', async (req, res) => {
    console.log('Body Request', req.body);
    try {
        const { title, description, course, batch, section, trainer, campus } = req.body;

        // Create a new Teacher Announcement
        const teacherAnnouncement = new TeacherAnnouncement({
            title,
            description,
            campus,
            course,
            batch,
            section,
            trainer,
        });

        // Save the teacher announcement
        const savedTeacherAnnouncement = await teacherAnnouncement.save();

        // Find all students in the selected section
        const studentsInSection = await Student.find({ section });

        // Prepare email content
        const emailSubject = `New Announcement: ${title}`;
        const emailBody = `
            <h3>${title}</h3>
            <p>${description}</p>
        `;

        // Loop through students and send emails
        for (const student of studentsInSection) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: student.email,
                subject: emailSubject,
                html: emailBody
            };

            // Send email
            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${student.email}`);
            } catch (error) {
                console.log(`Error sending email to ${student.email}:`, error);
            }
        }

        // Send the response with the saved announcement
        res.status(201).json(savedTeacherAnnouncement);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;