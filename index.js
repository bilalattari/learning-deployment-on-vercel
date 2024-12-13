import express from "express";
import usersRoutes from "./routers/users.js";
import mongoose from "mongoose";

const app = express();
const PORT = 4010;

const middleware = (req, res, next) => {
	next();
};

app.use(middleware);
app.use(express.json());

console.log(process.env.MONGO_URI);
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("mongoDB Connected"))
	.catch((err) => console.log(`err===> ${err}`));

app.use("/users", usersRoutes);

app.get("/", (req, res) => {
	const name = "Asheel";
	const obj = {
		name: "Asheel Ahmed Siddiqui",
		getReqTime: `Date: ${new Date().toDateString()}, Time: ${new Date().toLocaleTimeString()}`,
	};
	res.send(obj);
	console.log("get ki request");
});

app.listen(PORT, () => console.log("server is start at port 4010"));
