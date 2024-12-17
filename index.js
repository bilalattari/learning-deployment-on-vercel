import express from "express";
import usersRoutes from "./routers/users.js";
import trainersRoutes from "./routers/trainers.js";
import coursesRoutes from "./routers/courses.js";
import batchesRoutes from "./routers/batches.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/DB/connectDB.js";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 4010;

connectDB();

// Middleware to log requests
const middleware = (req, res, next) => {
	console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
	next();
};

app.use(middleware);
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/trainers", trainersRoutes);
app.use("/courses", coursesRoutes);

app.get("/", (req, res) => {
	const obj = {
		name: "Asheel Ahmed Siddiqui",
		getReqTime: `Date: ${new Date().toDateString()}, Time: ${new Date().toLocaleTimeString()}`,
	};
	res.send(obj);
	console.log("GET request received");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
