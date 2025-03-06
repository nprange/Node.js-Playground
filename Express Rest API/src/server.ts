import express from "express";
import { randomUUID } from "node:crypto";
import { Database } from "./database.ts";

const app = express();
const port = 3000;
const database = new Database();

const usersRouter = express.Router();

app.use(express.json());

usersRouter.get("/:id", (request, response) => {
	const { id } = request.params;
	const user = database.selectById("users", id);

	if (user) {
		response.status(200).json(user);
	} else {
		response.status(404).send();
	}
});

usersRouter.get("/", (request, response) => {
	const users = database.select("users");
	response.status(200).json(users);
});

usersRouter.post("/", (request, response) => {
	const { name, email } = request.body;
	const user = database.insert("users", {
		id: randomUUID(),
		name,
		email,
	});

	response.status(201).json(user);
});

usersRouter.put("/", (request, response) => {
	const { id, name, email } = request.body;
	database.update("users", id, {
		name,
		email,
	});

	response.status(204).send();
});

usersRouter.delete("/:id", (request, response) => {
	const { id } = request.params;
	database.delete("users", id);

	response.status(204).send();
});

app.get("/error", (request, response, next) => {
	next(new Error("Something went wrong!"));
});

app.use("/users", usersRouter);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
