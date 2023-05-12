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
app.get("/api/tasks", (req, res) => {
	db.query("SELECT * FROM todo").then((data) => {
		res.json(data.rows);
	});
});



// DELETE Task
app.delete("/api/tasks/:id", async (req, res) => {
	try {
		const id = req.params.id;

		await db.query("DELETE FROM todo WHERE id = $1", [id]).then(() => {
			res.send(`Deleted todo item with ID ${id}`);
		});
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

		//Validation
		// if (!description || !priority || Number.isNaN(priority)) {
		// 	res.sendStatus(422);
		// 	return;
		// }

		db.query("INSERT INTO todo (description, priority) VALUES ($1, $2) RETURNING *", [
			description,
			priority,
		]).then((result) => {
			res.status(201).send(result.rows);
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Error deleting todo item");
	}
});

app.listen(PORT, () => {
	console.log(`Listening on Port: ${PORT}`);
});
