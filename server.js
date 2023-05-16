import pg from "pg";
import express from "express";
import dotenv from "dotenv";

const app = express();
const PORT = 4000;

dotenv.config();

app.use(express.json());

const db = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

app.use(express.static("public"));

// GET request
app.get("/api/tasks", async (req, res) => {
	try {
		const data = await db.query("SELECT * FROM todo ORDER BY created_at");
		res.json(data.rows);
	} catch (err) {
		console.error(err);
		res.status(404).send("Error finding task database");
	}
});

// DELETE Task
app.delete("/api/tasks/:id", async (req, res) => {
	try {
		const id = req.params.id;

		await db.query("DELETE FROM todo WHERE id = $1", [id]);
		res.send(`Deleted todo item with ID ${id}`);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error deleting todo item");
	}
});

// POST task
app.post("/api/tasks", async (req, res) => {
	try {
		const { description } = req.body;
		const priority = Number(req.body.priority);

		// Validation
		if (!description || !priority || Number.isNaN(priority)) {
			res.sendStatus(422);
			return;
		}

		const result = await db.query(
			"INSERT INTO todo (description, priority, created_at) VALUES ($1, $2, $3) RETURNING *",
			[description, priority, new Date()]
		);
		res.status(201).send(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error deleting todo item");
	}
});

app.patch("/api/tasks/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { description, priority } = req.body;

		const data = await db.query(
			"UPDATE todo SET description = COALESCE($1, description), priority = COALESCE($2, priority) WHERE id = $3 RETURNING *",
			[description, priority, id]
		);
		const updatedTask = data.rows[0];
		res.send(updatedTask);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error updating task");
	}
});

app.listen(PORT, () => {
	console.log(`Listening on Port: ${PORT}`);
});
