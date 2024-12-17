import mongoose from "mongoose";
const { Schema } = mongoose;
const sectionSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		batchID: {
			type: Schema.Types.ObjectId,
			ref: "Batch",
			required: true,
		},
		teacher: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "ongoing", "merged", "finished"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

const Section = mongoose.model("Section", sectionSchema);
export default Section;
