
/* =================================
   DAYFLOW - APP ENGINE
================================= */

const today = new Date();
const dateKey = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

const $ = id => document.getElementById(id);

function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

let routines = load("dayflow_routines", [
  {id:1, name:"Wake up early", dates:[]},
  {id:2, name:"Drink enough water", dates:[]},
  {id:3, name:"Exercise", dates:[]},
  {id:4, name:"Read a book", dates:[]},
  {id:5, name:"Learn something new", dates:[]},
  {id:6, name:"Clean my room", dates:[]},
  {id:7, name:"Sleep on time", dates:[]}
]);

let tasks = load("dayflow_tasks", []);

function save() {
  localStorage.setItem("dayflow_routines", JSON.stringify(routines));
  localStorage.setItem("dayflow_tasks", JSON.stringify(tasks));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  })[char]);
}

/* DATE AND GREETING */

const hour = today.getHours();

$("todayDate").textContent = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

$("greeting").textContent =
  hour < 12 ? "Good morning! ☀️" :
  hour < 18 ? "Good afternoon! 🌤️" :
  "Good evening! 🌙";

/* NAVIGATION */

function showPage(page) {
  document.querySelectorAll(".page").forEach(el => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".nav button").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });

  $(page).classList.add("active");
}

document.querySelectorAll(".nav button").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

/* ROUTINES */

function addRoutine() {
  const input = $("routineInput");
  const name = input.value.trim();

  if (!name) return;

  routines.push({
    id: Date.now(),
    name,
    dates: []
  });

  input.value = "";
  save();
  render();
}

function toggleRoutine(id) {
  const item = routines.find(r => r.id === id);
  if (!item) return;

  item.dates ||= [];

  item.dates = item.dates.includes(dateKey)
    ? item.dates.filter(d => d !== dateKey)
    : [...item.dates, dateKey];

  save();
  render();
}

function deleteRoutine(id) {
  routines = routines.filter(r => r.id !== id);
  save();
  render();
}

/* TASKS */

function addTask() {
  const input = $("taskInput");
  const name = input.value.trim();

  if (!name) return;

  tasks.push({
    id: Date.now(),
    name,
    done: false
  });

  input.value = "";
  save();
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

/* DISPLAY */

function routineHTML(item) {
  const done = (item.dates || []).includes(dateKey);

  return `
    <div class="routine-item">
      <input type="checkbox"
        ${done ? "checked" : ""}
        onchange="toggleRoutine(${item.id})">

      <span class="${done ? "done" : ""}">
        ${escapeHTML(item.name)}
      </span>

      <button class="delete-btn"
        onclick="deleteRoutine(${item.id})">×</button>
    </div>
  `;
}

function taskHTML(task) {
  return `
    <div class="task-item">
      <input type="checkbox"
        ${task.done ? "checked" : ""}
        onchange="toggleTask(${task.id})">

      <span class="${task.done ? "done" : ""}">
        ${escapeHTML(task.name)}
      </span>

      <button class="delete-btn"
        onclick="deleteTask(${task.id})">×</button>
    </div>
  `;
}

/* STREAK */

function calculateStreak() {
  const activeDays = new Set();

  routines.forEach(item => {
    (item.dates || []).forEach(date => activeDays.add(date));
  });

  let streak = 0;
  const cursor = new Date();

  if (!activeDays.has(dateKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = [
      cursor.getFullYear(),
      String(cursor.getMonth() + 1).padStart(2, "0"),
      String(cursor.getDate()).padStart(2, "0")
    ].join("-");

    if (!activeDays.has(key)) break;

    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/* MAIN RENDER */

function render() {
  const done = routines.filter(r =>
    (r.dates || []).includes(dateKey)
  ).length;

  const total = routines.length;
  const percent = total
    ? Math.round(done / total * 100)
    : 0;

  $("routineList").innerHTML =
    routines.map(routineHTML).join("") ||
    '<p class="empty">No routines yet. Add one above!</p>';

  $("dashboardRoutines").innerHTML =
    routines.map(routineHTML).join("") ||
    '<p class="empty">Add your first routine!</p>';

  $("taskList").innerHTML =
    tasks.map(taskHTML).join("") ||
    '<p class="empty">No tasks yet. Add one above!</p>';

  $("dashboardTasks").innerHTML =
    tasks.filter(t => !t.done).map(taskHTML).join("") ||
    '<p class="empty">You have no pending tasks. Great job! 🎉</p>';

  $("habitList").innerHTML =
    routines.map(routineHTML).join("");

  $("routineCount").textContent = `${done}/${total}`;

  $("taskCount").textContent =
    tasks.filter(t => !t.done).length;

  $("streakCount").textContent =
    calculateStreak() + " 🔥";

  $("mainProgress").style.width = percent + "%";

  $("progressText").textContent =
    percent + "% completed";

  $("summary").textContent =
    done === total && total > 0
      ? "Amazing! You completed all your routines! 🎉"
      : `${total - done} routines remaining. Keep going!`;
}

/* START APP */

render();
