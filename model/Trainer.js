import mongoose from "mongoose";
const { Schema } = mongoose;

const trainerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "trainer", required: true }, // fixed the typo
    salary: { type: Number, required: true },
    field: { type: String, required: true },
    timing: { type: String, required: true },
    course: { type: String, required: true },
    batch: { type: String, required: true },
    section: { type: [String], default: [] } // assuming section is an array of strings
  },
  { timestamps: true }
);

const Trainer = mongoose.model("Trainer", trainerSchema);
export default Trainer;
