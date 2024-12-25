// import express from "express";
// const router = express.Router();
// import User from "../model/User.js";

// router.get("/", async (req, res) => {
// 	const users = await User.find();
// 	res.status(200).json({
// 		msg: "User fetched successfully",
// 		error: false,
// 		data: users,
// 	});
// });

// router.post("/", async (req, res) => {
// 	const { name, email, password, role } = req.body;
// 	// Create new user
// 	const newUser = new User({ name, email, password, role });

// 	// Save to database
// 	const savedUser = await newUser.save();

// 	res.status(201).json({
// 		msg: "User added successfully",
// 		data: savedUser,
// 		error: false,
// 	});
// });

// export default router;

import express from "express";
import { login, signUp } from "../controllers/authController.js";
import jwt from "jsonwebtoken"; // Import JWT for token verification
import User from "../model/User.js";
import sendResponse from "../helpers/sendResponse.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

// Middleware to verify token
const verifyToken = (req, res, next) => {
	const token = req.header("Authorization");
	if (!token) return res.status(403).json({ msg: "Access denied" });
  
	try {
	  const verified = jwt.verify(token, process.env.JWT_SECRET);
	  req.user = verified;
	  next();
	} catch (err) {
	  res.status(400).json({ msg: "Invalid token" });
	}
  };

  export function authenticateUser(req, res, next) {
	const bearerTOken = req.headers?.authorization;
	console.log("bearerTOken=>", bearerTOken);
	if (!bearerTOken)
	  return sendResponse(res, 400, null, true, "Token Not Provided");
  
	const token = bearerTOken.split(" ")[1];
  
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
	req.user = decoded;
	console.log("decoded=>", decoded);
	next();
  }
  
  // Route to get user data by verifying the token
//   router.get("/profile", verifyToken, async (req, res) => {
// 	try {
// 	  // Fetch user data based on the ID from the token
// 	  const user = await User.findById(req.user.userId).select("-password");
// 	  if (!user) {
// 		return res.status(404).json({ msg: "User not found" });
// 	  }
// 	  res.json(user);
// 	} catch (error) {
// 	  res.status(500).json({ msg: "Server error", error: error.message });
// 	}	
//   });

router.get("/profile", authenticateUser, async (req, res) => {
	try {
	  const user = await User.findOne({
		_id: req.user._id,
	  });
	  sendResponse(res, 200, user, false, "User Updated Successfully");
	} catch (err) {
	  sendResponse(res, 500, null, true, "Something went wrong");
	}
  });

export default router;

