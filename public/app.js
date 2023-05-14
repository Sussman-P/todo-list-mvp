const taskContainer = document.querySelector(".tasks");
const taskInput = document.getElementById("description");
const taskPriority = document.getElementById("priority");

// Fetching the GET REQUEST
fetch("/api/tasks")
	.then((res) => res.json())
	.then((tasks) => {
		for (let task of tasks) {
			// Tasks Div
			const taskDiv = document.createElement("div");
			taskDiv.className = "task-items";

			//creating an H2 title for tasks
			const h2 = document.createElement("h2");
			h2.className = "task-name";
			h2.textContent = task.description;

			//appending H2 to task DIV
			taskDiv.append(h2);

			// Priority info
			const priorityNum = document.createElement("div");
			priorityNum.className = "priority-num";
			priorityNum.textContent = `Priority: ${task.priority}`;
			taskDiv.append(priorityNum);

			// Delete Btn
			const deleteBtn = document.createElement("button");
			deleteBtn.className = "delete-btn";
			deleteBtn.textContent = "Delete task!";
			const btnID = task.id;

			deleteBtn.addEventListener("click", () => {
				// Fetching the DELETE REQUEST
				fetch(`/api/tasks/${btnID}`, { method: "DELETE" });
				console.log(btnID);
			});
			deleteBtn.addEventListener("click", () => {
				taskDiv.remove();
			});
			// adds the delete btn to task div
			taskDiv.append(deleteBtn);

			// add the task item div to task container.
			taskContainer.appendChild(taskDiv);
		}
	});

// Fetching the POST REQUEST
function postData(data) {
	fetch("/api/tasks", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			console.log(data[0].description);

			// Tasks Div
			const taskDiv = document.createElement("div");
			taskDiv.className = "task-items";
			const h2 = document.createElement("h2");
			h2.textContent = data[0].description;
			h2.className = "task-name";
			taskDiv.append(h2);

			// Priority info
			const priorityNum = document.createElement("div");
			priorityNum.className = "priority-num";
			priorityNum.textContent = `Priority: ${data[0].priority}`;
			taskDiv.append(priorityNum);

			// Delete Btn
			const deleteBtn = document.createElement("button");
			deleteBtn.className = "delete-btn";
			deleteBtn.textContent = "Delete task!";
			const btnID = data[0].id;

			deleteBtn.addEventListener("click", () => {
				fetch(`/api/tasks/${btnID}`, { method: "DELETE" });
				console.log(btnID);
			});
			deleteBtn.addEventListener("click", () => {
				taskDiv.remove();
			});
			// adds the delete btn to task div
			taskDiv.append(deleteBtn);

			// add the task item div to task container.
			taskContainer.appendChild(taskDiv);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

const form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(form);

	const data = {
		description: formData.get("description"),
		priority: formData.get("priority"),
	};

	if (!data.description || !data.priority) {
		alert("Please try again!");
	}

	postData(data);
	form.reset();
});
