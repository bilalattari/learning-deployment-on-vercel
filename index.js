import express from "express";
import usersRoutes from "./routers/users.js";
import trainersRoutes from "./routers/trainers.js";
import coursesRoutes from "./routers/courses.js";
import campusRoutes from "./routers/campus.js";
import batchesRoutes from "./routers/batches.js";
import sectionsRoutes from "./routers/sections.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/DB/connectDB.js";
import cors from "cors";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 4010;

// Connect to the database
connectDB();
// CORS configuration to allow your frontend
app.use(
	cors({
	  origin: [
		"http://localhost:5173",  // Allow localhost for development
		"https://manegement-system.vercel.app",  // Allow Vercel URL for production
	  ], // Allow these specific frontend addresses
	  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
	  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
	})
  );
  
// Middleware to log requests
const middleware = (req, res, next) => {
	console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
	next();
};

app.use(middleware);
app.use(express.json());

// Routes
app.use("/users", usersRoutes);
app.use("/trainers", trainersRoutes);
app.use("/courses", coursesRoutes);
app.use("/campus", campusRoutes);
app.use("/batches", batchesRoutes);
app.use("/section", sectionsRoutes);

// Home Route
app.get("/", (req, res) => {
	const obj = {
		name: "Asheel Ahmed Siddiqui",
		getReqTime: `Date: ${new Date().toDateString()}, Time: ${new Date().toLocaleTimeString()}`,
	};
	res.send(obj);
	console.log("GET request received");
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
