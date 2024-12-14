import mongoose from "mongoose";
const { Schema } = mongoose;
const trainerSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: { type: String, defualt: "trainer", required: true },
		salary: { type: Number, required: true },
		field: { type: String, required: true },
		timing: { type: String, required: true },
		course: { type: String, required: true },
		batch: { type: String, required: true },
	},
	{ timestamps: true }
);

const Trainer = mongoose.model("Trainer", trainerSchema);
export default Trainer;
