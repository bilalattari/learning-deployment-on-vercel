import mongoose from "mongoose";
const { Schema } = mongoose;

const trainerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "trainer", required: true },
    salary: { type: Number, required: true },
    specialization: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    password: { type: String, required: true }, // New field for password
    image: { type: String },
    resume: { type: String },
  },
  { timestamps: true }
);

const Trainer = mongoose.model("Trainer", trainerSchema);
export default Trainer;
