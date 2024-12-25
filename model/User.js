// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const userSchema = new Schema(
// 	{
// 		name: { type: String, required: true },
// 		email: { type: String, required: true, unique: true },
// 		password: { type: String, required: true },
// 		platform: { type: String, enum: ["google"], default: "google" },
// 		role: {
// 			type: String,
// 			enum: ["student", "teacher", "admin"],
// 			default: "student",
// 			required: true,
// 		},
// 	},
// 	{ timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// export default User;




import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
