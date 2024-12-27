// import express from 'express';
// import cloudinary from 'cloudinary';
// import multer from 'multer';
// import QRCode from 'qrcode';
// import Student from '../model/Student.js';

// const router = express.Router();

// // Cloudinary Configuration
// cloudinary.config({
//     cloud_name: 'duvdqnoht',
//     api_key: '538347923483567',
//     api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0'
// });

// // Multer Configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Generate Roll Number
// const generateRollNumber = async () => {
//     const count = await Student.countDocuments() + 1;
//     return count.toString().padStart(6, '0'); // Example: 000001
// };

// // Add Student Route
// router.post('/', upload.single('image'), async (req, res) => {

//     // console.log('Cloudinary Config:', cloudinary.v2.config());
//     // console.log('Received file:', req.file);

//     try {
//         const {
//             name, email, fatherName, phoneNo, whatsappNo, cnic, fatherCnic,
//             qualification, campus, trainer, course, batch, section, gender, address
//         } = req.body;

//         // Generate Roll Number
//         const rollNumber = await generateRollNumber();

//         // Upload Image to Cloudinary
//         const imageUpload = await cloudinary.uploader.upload(
//             `data:image/png;base64,${req.file.buffer.toString('base64')}`
//         );

//         // Generate QR Code
//         const qrData = `${rollNumber} - ${name}`;
//         const qrCode = await QRCode.toDataURL(qrData);

//         // Create Student
//         const student = new Student({
//             name,
//             email,
//             fatherName,
//             phoneNo,
//             whatsappNo,
//             cnic,
//             fatherCnic,
//             qualification,
//             campus,
//             trainer,
//             course,
//             batch,
//             section,
//             gender,
//             address,
//             rollNumber,
//             image: imageUpload.secure_url,
//             qrCode
//         });

//         await student.save();

//         res.status(201).json({ message: 'Student added successfully!', student });
//     } catch (error) {
//         console.error('Error adding student:', error);
//         res.status(500).json({ error: 'Failed to add student.' });
//     }
// });

// // Get All Students
// router.get('/', async (req, res) => {
//     try {
//         const students = await Student.find().populate('campus trainer course batch section');
//         res.status(200).json(students);
//     } catch (error) {
//         console.error('Error fetching students:', error);
//         res.status(500).json({ error: 'Failed to fetch students.' });
//     }
// });

// export default router;








import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer'; // Import Nodemailer
import Student from '../model/Student.js';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'duvdqnoht',
    api_key: '538347923483567',
    api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0'
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Nodemailer Configuration
// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shoaibrazamemon170@gmail.com', // Replace with your email
        pass: 'dbze dxhh lgms kzmj' // Replace with your password or app password
    }
});

// Generate Roll Number
const generateRollNumber = async () => {
    const count = await Student.countDocuments() + 1;
    return count.toString().padStart(6, '0'); // Example: 000001
};

// Add Student Route
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const {
            name, email, fatherName, phoneNo, whatsappNo, cnic, fatherCnic,
            qualification, campus, trainer, course, batch, section, gender, address , password
        } = req.body;

        // Generate Roll Number
        const rollNumber = await generateRollNumber();

        // Upload Image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(
            `data:image/png;base64,${req.file.buffer.toString('base64')}`
        );

        // Generate QR Code
        const qrData = `${rollNumber} - ${name}`;
        const qrCode = await QRCode.toDataURL(qrData);

        // Create Student
        const student = new Student({
            name,
            email,
            fatherName,
            phoneNo,
            whatsappNo,
            cnic,
            fatherCnic,
            qualification,
            campus,
            trainer,
            course,
            batch,
            section,
            gender,
            address,
            password,
            rollNumber,
            image: imageUpload.secure_url,
            qrCode
        });

        await student.save();

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email
            to: email, // Student's email
            subject: 'Welcome to Our Training Program!',
            html: `
                <h2>Dear ${name},</h2>
                <p>Congratulations! You have been successfully registered for the training program.</p>
                <p><strong>Roll Number:</strong> ${rollNumber}</p>
                <p><strong>Your Password:</strong> ${password}</p>
                <p>We are excited to have you onboard and look forward to seeing you grow and succeed!</p>
                <p>If you have any questions, feel free to contact us.</p>
                <br>
                <p>SMIT Regards,</p>
                <p><strong>Your Training Team</strong></p>
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ error: 'Failed to send email.' });
            }
            console.log('Email sent:', info.response);
        });

        res.status(201).json({ message: 'Student added successfully!', student });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Failed to add student.' });
    }
});

// Get All Students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().populate('campus trainer course batch section');
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students.' });
    }
});

export default router;
