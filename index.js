import express from "express";

const app = express();
const PORT = 4010;

const middleware = (req, res, next) => {
	next();
};

app.use(middleware);
app.use(express.json());

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
