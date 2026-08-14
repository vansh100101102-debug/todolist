const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createId() {
    return Date.now().toString() + Math.random().toString(36).substring(2);
}

function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-message">
                No tasks added yet.
            </div>
        `;
        return;
    }

    tasks.forEach(function(task) {

        const taskElement = document.createElement("div");

        taskElement.classList.add("task");

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        taskElement.innerHTML = `
            <button 
                class="task-checkbox ${task.completed ? "completed" : ""}"
                data-id="${task.id}"
                aria-label="Complete task">
            </button>

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <div class="actions">

                <button 
                    class="action-btn edit-btn"
                    data-id="${task.id}"
                    aria-label="Edit task">

                    <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">

                        <path 
                            d="M4 20H8L19 9C20.1 7.9 20.1 6.1 19 5C17.9 3.9 16.1 3.9 15 5L4 16V20Z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                        </path>

                        <path 
                            d="M13.5 6.5L17.5 10.5"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round">
                        </path>

                    </svg>

                </button>

                <button 
                    class="action-btn delete-btn"
                    data-id="${task.id}"
                    aria-label="Delete task">

                    <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">

                        <path 
                            d="M4 7H20"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round">
                        </path>

                        <path 
                            d="M10 11V17"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round">
                        </path>

                        <path 
                            d="M14 11V17"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round">
                        </path>

                        <path 
                            d="M6 7L7 20H17L18 7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                        </path>

                        <path 
                            d="M9 7V4H15V7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                        </path>

                    </svg>

                </button>

            </div>
        `;

        taskList.appendChild(taskElement);
    });
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: createId(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();
}

function toggleTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderTasks();
}

function deleteTask(id) {
    const isConfirmed = confirm("Are you sure you want to delete this task?");

    if (!isConfirmed) {
        return; 
    }

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const taskElement = document.querySelector(
        `.task-checkbox[data-id="${id}"]`
    ).closest(".task");

    const textElement = taskElement.querySelector(".task-text");

    const input = document.createElement("input");

    input.type = "text";
    input.className = "edit-input";
    input.value = task.text;

    textElement.replaceWith(input);

    input.focus();
    input.select();

    function finishEdit() {

        const newText = input.value.trim();

        if (newText !== "") {
            task.text = newText;
            saveTasks();
        }

        renderTasks();
    }

    input.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            finishEdit();
        }

        if (event.key === "Escape") {
            renderTasks();
        }
    });

    input.addEventListener("blur", finishEdit);
}

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

taskList.addEventListener("click", function(event) {

    const checkbox = event.target.closest(".task-checkbox");

    if (checkbox) {

        const id = checkbox.dataset.id;

        toggleTask(id);

        return;
    }

    const editButton = event.target.closest(".edit-btn");

    if (editButton) {

        const id = editButton.dataset.id;

        editTask(id);

        return;
    }

    const deleteButton = event.target.closest(".delete-btn");

    if (deleteButton) {

        const id = deleteButton.dataset.id;

        deleteTask(id);

        return;
    }
});

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();