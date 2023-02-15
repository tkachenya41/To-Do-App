const form = document.querySelector(".header");
const tasksList = document.querySelector(".tasksList");
const taskInput = document.querySelector("#taskInput");
let editingTaskId = null;

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

form.addEventListener("click", addTask);

form.addEventListener("click", deleteAllTasks);

tasksList.addEventListener("click", deleteTask);

tasksList.addEventListener("click", completeTask);

form.addEventListener("keydown", addTaskByEnter);

tasksList.addEventListener("click", editTask);

function addTask(event) {
  event.preventDefault();
  if (event.target.dataset.action === "add") {
    const taskText = taskInput.value;

    const newTask = {
      id: Date.now(),
      text: taskText,
      done: false,
      date: new Date().toLocaleDateString(),
    };

    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    taskInput.value = "";
    taskInput.focus();
  }
}

function addTaskByEnter(event) {
  if (event.key === "Enter" && event.target.dataset.action === "addByEnter") {
    event.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
      id: Date.now(),
      text: taskText,
      done: false,
      date: new Date().toLocaleDateString(),
    };

    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    taskInput.value = "";
    taskInput.focus();
  }
}

function deleteTask(event) {
  if (event.target.dataset.action === "delete") {
    const parentNode = event.target.closest("li");

    const id = Number(parentNode.id);

    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();

    parentNode.remove();
  }
}

function editTask(event) {
  if (event.target.dataset.action === "edit") {
    const parentNode = event.target.closest("li");
    const taskText = parentNode.querySelector(".taskText");

    const id = Number(parentNode.id);

    if (editingTaskId !== id) {
      editingTaskId = id;
      taskText.focus();
    } else {
      const task = tasks.find((task) => task.id === id);

      if (task.text !== taskText.value) {
        task.text = taskText.value;
        saveToLocalStorage();
      }
      taskText.blur();
      editingTaskId = null;
    }
  }
}

function completeTask(event) {
  if (event.target.dataset.action === "complete") {
    const parentNode = event.target.closest("li");

    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id);

    task.done = !task.done;

    saveToLocalStorage();

    const taskText = parentNode.querySelector(".taskText");
    taskText.classList.toggle("complete");
  }
}

function deleteAllTasks(event) {
  if (event.target.dataset.action === "delete-all") {
    tasks = [];

    saveToLocalStorage();

    do {
      tasksList.firstChild.remove();
    } while (tasksList.firstChild);
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "taskText complete" : "taskText";

  taskHTML = `<li id="${task.id}"class="task">
  <div class="left_task">
    <button class="completeTask" data-action = "complete">
      <img src="./icons/tick.png" alt="tick" />
    </button>
    <input type="text" class="${cssClass}" value="${task.text}" /> </div>
  </div>
  <div class="right_task">
    <button class="deleteTask" data-action="delete">
      <img src="./icons/cross.png" alt="cross" />
    </button>
    <button class="editTask" data-action="edit">Edit</button>
    <input type="text" value="${task.date}" />
  </div>
</li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
