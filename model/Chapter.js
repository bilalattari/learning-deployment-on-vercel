import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
    {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        order: { type: Number, required: true },
    },
    { timestamps: true },
)

const Chapter = mongoose.model("Chapters", ChapterSchema);
export default Chapter;
