const taskContainer = document.querySelector(".tasks");
const taskInput = document.getElementById("description");

taskInput.focus();

// Task creation form
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

let taskCreation = (task) => {
	// Tasks Div
	const taskDiv = document.createElement("div");
	taskDiv.className = "task-items";

	//creating an H2 title for tasks
	const h2 = document.createElement("h2");
	h2.className = "task-name";
	h2.textContent = task.description;

	h2.addEventListener("click", () => {
		const input = document.createElement("input");
		input.setAttribute("type", "text");
		input.setAttribute("value", h2.innerText);

		input.addEventListener("blur", () => {
			const newVal = input.value;
			const taskID = task.id;

			if (newVal === h2.innerHTML) {
				console.log("nothing changed!");
				input.replaceWith(h2);
				return;
			}
			// PATCH REQUEST
			fetch(`/api/tasks/${taskID}`, {
				method: "PATCH",
				body: JSON.stringify({ description: newVal }),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					h2.innerText = data.description;
					input.replaceWith(h2);
				})
				.catch((error) => {
					console.error("Error updating text:", error);
				});
		});
		h2.replaceWith(input);
		input.focus();
	});

	//appending H2 to task DIV
	taskDiv.append(h2);

	// Priority info
	const priorityContainer = document.createElement("span");
	const priorityLabel = document.createElement("span");
	const priorityNum = document.createElement("span");
	priorityNum.className = "priority-num";
	priorityLabel.textContent = "Priority: ";
	priorityNum.textContent = task.priority;

	priorityNum.addEventListener("click", () => {
		// const input = document.createElement("input");
		// input.setAttribute("type", "text");
		// input.setAttribute("value", priorityNum.innerText);

		const select = document.createElement("select");

		for (let i = 1; i <= 3; i++) {
			const option = document.createElement("option");
			option.setAttribute("value", i);
			option.innerText = i;
			select.appendChild(option);
		}

		select.value = priorityNum.innerText;

		select.addEventListener("blur", () => {
			const newVal = select.value;
			const taskID = task.id;

			if (newVal === priorityNum.innerHTML) {
				console.log("nothing changed!");
				select.replaceWith(priorityNum);
				return;
			}
			// PATCH REQUEST
			fetch(`/api/tasks/${taskID}`, {
				method: "PATCH",
				body: JSON.stringify({ priority: newVal }),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					priorityNum.innerText = data.priority;
					select.replaceWith(priorityNum);
				})
				.catch((error) => {
					console.error("Error updating text:", error);
				});
		});
		priorityNum.replaceWith(select);
		select.focus();
	});

	priorityContainer.append(priorityLabel, priorityNum);
	taskDiv.append(priorityContainer);

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
	// add the tasks to task container.
	taskContainer.appendChild(taskDiv);
};

// GET REQUEST
fetch("/api/tasks")
	.then((res) => res.json())
	.then((tasks) => {
		for (let task of tasks) {
			taskCreation(task);
		}
	});

// POST REQUEST
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
			taskCreation(data);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}
