// Backend: Routes (routes/authRoutes.js)
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/User.js";

const router = express.Router();

const generateToken = (user) => {
	return jwt.sign({ id: user._id, email: user.email, role: user.role }, "secretkey", {
		expiresIn: "1h",
	});
};

// Signup
router.post("/signup", async (req, res) => {
	const { name, email, password, role } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ name, email, password: hashedPassword, role });
		await newUser.save();

		const token = generateToken(newUser);
		res.cookie("token", token, { httpOnly: true });

		res.status(201).json({ msg: "User registered successfully", token });
	} catch (error) {
		res.status(500).json({ msg: "Error registering user", error: error.message });
	}
});

// Login
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ msg: "User not found" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

		const token = generateToken(user);
		res.cookie("token", token, { httpOnly: true });

		res.status(200).json({ msg: "Login successful", token, role: user.role, name: user.name, email: user.email, });
	} catch (error) {
		res.status(500).json({ msg: "Error logging in", error: error.message });
	}
});

router.get("/profile", async (req, res) => {
	try {
	  console.log("Cookies: ", req.cookies); // Debug cookies received
  
	  const token = req.cookies.token; // Check if token exists
	  if (!token) return res.status(401).json({ msg: "Unauthorized" });
  
	  const decoded = jwt.verify(token, "secretkey");
	  const user = await User.findById(decoded.id).select("-password");
  
	  res.status(200).json(user);
	} catch (error) {
	  console.error("Error: ", error.message);
	  res.status(500).json({ msg: "Error fetching user data", error: error.message });
	}
  });
  

export default router;