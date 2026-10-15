// ====================
// Navigation
// ====================

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");
const sectionButtons = document.querySelectorAll("[data-section]");

function showSection(sectionId) {

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.section === sectionId) {
            item.classList.add("active");
        }

    });
}

sectionButtons.forEach(button => {

    button.addEventListener("click", () => {
        showSection(button.dataset.section);
    });

});


// ====================
// Tasks
// ====================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskCategory =
    document.getElementById("taskCategory");

const taskPriority =
    document.getElementById("taskPriority");

const taskDate =
    document.getElementById("taskDate");

const taskList =
    document.getElementById("taskList");

const taskSearch =
    document.getElementById("taskSearch");


function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


function renderTasks(searchText = "") {

    taskList.innerHTML = "";

    const filteredTasks =
        tasks.filter(task =>
            task.title
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                )
        );

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                No tasks available.
            </p>
        `;

        updateDashboard();

        return;
    }

    filteredTasks.forEach(task => {

        const taskItem =
            document.createElement("div");

        taskItem.className =
            `task-item ${task.completed ? "completed" : ""}`;

        taskItem.innerHTML = `

            <div class="task-info">

                <input
                    type="checkbox"
                    class="complete-task"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <div class="task-details">

                    <h4>${task.title}</h4>

                    <p>
                        ${task.category} •
                        ${task.priority}
                        ${task.date ? ` • Due: ${task.date}` : ""}
                    </p>

                </div>

            </div>

            <div class="item-actions">

                <button
                    type="button"
                    class="edit-btn"
                    data-id="${task.id}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    data-id="${task.id}"
                >
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskItem);

    });

    addTaskEvents();
}


function addTaskEvents() {

    document
        .querySelectorAll(".complete-task")
        .forEach(button => {

            button.addEventListener("change", () => {

                const taskId =
                    Number(button.dataset.id);

                const task =
                    tasks.find(
                        task => task.id === taskId
                    );

                if (task) {

                    task.completed =
                        button.checked;

                    saveTasks();

                    renderTasks(
                        taskSearch.value
                    );

                }

            });

        });


    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const taskId =
                    Number(button.dataset.id);

                tasks =
                    tasks.filter(
                        task => task.id !== taskId
                    );

                saveTasks();

                renderTasks(
                    taskSearch.value
                );

            });

        });


    document
        .querySelectorAll(".edit-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const taskId =
                    Number(button.dataset.id);

                const task =
                    tasks.find(
                        task => task.id === taskId
                    );

                if (!task) {
                    return;
                }

                taskTitle.value =
                    task.title;

                taskCategory.value =
                    task.category;

                taskPriority.value =
                    task.priority;

                taskDate.value =
                    task.date;

                tasks =
                    tasks.filter(
                        task => task.id !== taskId
                    );

                saveTasks();

                renderTasks(
                    taskSearch.value
                );

                showSection("tasks");

                taskTitle.focus();

            });

        });

}


taskForm.addEventListener("submit", event => {

    event.preventDefault();

    const newTask = {

        id: Date.now(),

        title:
            taskTitle.value.trim(),

        category:
            taskCategory.value,

        priority:
            taskPriority.value,

        date:
            taskDate.value,

        completed: false

    };

    if (!newTask.title) {
        return;
    }

    tasks.push(newTask);

    saveTasks();

    taskForm.reset();

    renderTasks();

    updateDashboard();

    showSection("tasks");

});


taskSearch.addEventListener("input", () => {

    renderTasks(
        taskSearch.value
    );

});


// ====================
// Expenses
// ====================

let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

const expenseForm =
    document.getElementById("expenseForm");

const expenseAmount =
    document.getElementById("expenseAmount");

const expenseCategory =
    document.getElementById("expenseCategory");

const expenseDate =
    document.getElementById("expenseDate");

const expenseDescription =
    document.getElementById("expenseDescription");

const expenseList =
    document.getElementById("expenseList");

const expenseTotal =
    document.getElementById("expenseTotal");


function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}


function renderExpenses() {

    expenseList.innerHTML = "";

    if (expenses.length === 0) {

        expenseList.innerHTML = `
            <p class="empty-message">
                No expenses available.
            </p>
        `;

        expenseTotal.textContent =
            "₹0";

        updateDashboard();

        return;
    }

    let total = 0;

    expenses.forEach(expense => {

        total +=
            Number(expense.amount);

        const expenseItem =
            document.createElement("div");

        expenseItem.className =
            "expense-item";

        expenseItem.innerHTML = `

            <div>

                <h4>₹${expense.amount}</h4>

                <p>
                    ${expense.category}
                    ${expense.date ? ` • ${expense.date}` : ""}
                </p>

                ${
                    expense.description
                    ? `<small>${expense.description}</small>`
                    : ""
                }

            </div>

            <button
                type="button"
                class="delete-expense"
                data-id="${expense.id}"
            >
                Delete
            </button>
        `;

        expenseList.appendChild(
            expenseItem
        );

    });

    expenseTotal.textContent =
        `₹${total}`;

    addExpenseEvents();

}


function addExpenseEvents() {

    document
        .querySelectorAll(".delete-expense")
        .forEach(button => {

            button.addEventListener("click", () => {

                const expenseId =
                    Number(button.dataset.id);

                expenses =
                    expenses.filter(
                        expense =>
                            expense.id !== expenseId
                    );

                saveExpenses();

                renderExpenses();

            });

        });

}


expenseForm.addEventListener("submit", event => {

    event.preventDefault();

    const amount =
        Number(expenseAmount.value);

    if (!amount || amount < 0) {
        return;
    }

    const newExpense = {

        id: Date.now(),

        amount:
            amount,

        category:
            expenseCategory.value,

        date:
            expenseDate.value,

        description:
            expenseDescription.value.trim()

    };

    expenses.push(newExpense);

    saveExpenses();

    expenseForm.reset();

    renderExpenses();

});


// ====================
// Goals
// ====================

let goals =
    JSON.parse(localStorage.getItem("goals")) || [];

const goalForm =
    document.getElementById("goalForm");

const goalName =
    document.getElementById("goalName");

const goalProgress =
    document.getElementById("goalProgress");

const goalList =
    document.getElementById("goalList");


function saveGoals() {

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );

}


function renderGoals() {

    goalList.innerHTML = "";

    if (goals.length === 0) {

        goalList.innerHTML = `
            <p class="empty-message">
                No goals available.
            </p>
        `;

        updateDashboard();

        return;
    }

    goals.forEach(goal => {

        const goalItem =
            document.createElement("div");

        goalItem.className =
            "goal-card";

        goalItem.innerHTML = `

            <div class="card-header">

                <div>

                    <h3>${goal.name}</h3>

                    <p>
                        ${goal.progress}% completed
                    </p>

                </div>

                <button
                    type="button"
                    class="delete-goal"
                    data-id="${goal.id}"
                >
                    Delete
                </button>

            </div>

            <div class="goal-progress">

                <div
                    class="goal-progress-bar"
                    style="width: ${goal.progress}%"
                ></div>

            </div>
        `;

        goalList.appendChild(
            goalItem
        );

    });

    addGoalEvents();

}


function addGoalEvents() {

    document
        .querySelectorAll(".delete-goal")
        .forEach(button => {

            button.addEventListener("click", () => {

                const goalId =
                    Number(button.dataset.id);

                goals =
                    goals.filter(
                        goal =>
                            goal.id !== goalId
                    );

                saveGoals();

                renderGoals();

            });

        });

}


goalForm.addEventListener("submit", event => {

    event.preventDefault();

    const progress =
        Number(goalProgress.value);

    if (
        !goalName.value.trim() ||
        progress < 0 ||
        progress > 100
    ) {
        return;
    }

    const newGoal = {

        id: Date.now(),

        name:
            goalName.value.trim(),

        progress:
            progress

    };

    goals.push(newGoal);

    saveGoals();

    goalForm.reset();

    renderGoals();

});


// ====================
// Notes
// ====================

let notes =
    JSON.parse(localStorage.getItem("notes")) || [];

const noteForm =
    document.getElementById("noteForm");

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const noteSearch =
    document.getElementById("noteSearch");

const noteList =
    document.getElementById("noteList");


function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

}


function renderNotes(searchText = "") {

    noteList.innerHTML = "";

    const filteredNotes =
        notes.filter(note =>
            note.title
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                ) ||

            note.content
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                )
        );

    if (filteredNotes.length === 0) {

        noteList.innerHTML = `
            <p class="empty-message">
                No notes available.
            </p>
        `;

        return;
    }

    filteredNotes.forEach(note => {

        const noteItem =
            document.createElement("div");

        noteItem.className =
            "note-item";

        noteItem.innerHTML = `

            <div>

                <h4>${note.title}</h4>

                <p>${note.content}</p>

            </div>

            <button
                type="button"
                class="delete-note"
                data-id="${note.id}"
            >
                Delete
            </button>

        `;

        noteList.appendChild(
            noteItem
        );

    });

    addNoteEvents();

}


function addNoteEvents() {

    document
        .querySelectorAll(".delete-note")
        .forEach(button => {

            button.addEventListener("click", () => {

                const noteId =
                    Number(button.dataset.id);

                notes =
                    notes.filter(
                        note =>
                            note.id !== noteId
                    );

                saveNotes();

                renderNotes(
                    noteSearch.value
                );

            });

        });

}


noteForm.addEventListener("submit", event => {

    event.preventDefault();

    const title =
        noteTitle.value.trim();

    const content =
        noteContent.value.trim();

    if (!title || !content) {
        return;
    }

    const newNote = {

        id: Date.now(),

        title:
            title,

        content:
            content

    };

    notes.push(newNote);

    saveNotes();

    noteForm.reset();

    renderNotes();

});


noteSearch.addEventListener("input", () => {

    renderNotes(
        noteSearch.value
    );

});


// ====================
// User Profile
// ====================

const userNameInput =
    document.getElementById("userName");

const welcomeName =
    document.getElementById("welcomeName");

const profileName =
    document.getElementById("profileName");

const profileAvatar =
    document.getElementById("profileAvatar");

const greeting =
    document.getElementById("greeting");


function updateUserName(name) {

    name =
        name.trim();

    if (name === "") {

        welcomeName.textContent =
            "";

        profileName.textContent =
            "User";

        profileAvatar.textContent =
            "U";

        localStorage.removeItem(
            "userName"
        );

        return;
    }

    localStorage.setItem(
        "userName",
        name
    );

    welcomeName.textContent =
        name;

    profileName.textContent =
        name;

    profileAvatar.textContent =
        name.charAt(0).toUpperCase();

}


const savedName =
    localStorage.getItem(
        "userName"
    );

if (savedName) {

    userNameInput.value =
        savedName;

    updateUserName(
        savedName
    );

}


userNameInput.addEventListener(
    "input",
    () => {

        updateUserName(
            userNameInput.value
        );

    }
);


// ====================
// Greeting
// ====================

function updateGreeting() {

    const hour =
        new Date().getHours();

    if (hour < 12) {

        greeting.textContent =
            "Good Morning";

    } else if (hour < 18) {

        greeting.textContent =
            "Good Afternoon";

    } else {

        greeting.textContent =
            "Good Evening";

    }

}

updateGreeting();


// ====================
// Dark / Light Mode
// ====================

const themeToggle =
    document.getElementById("themeToggle");

let darkMode =
    localStorage.getItem("darkMode") === "true";


function updateTheme() {

    if (!themeToggle) {
        return;
    }

    if (darkMode) {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent =
            "☀️ Light Mode";

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        themeToggle.textContent =
            "🌙 Dark Mode";

    }

}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            darkMode =
                !darkMode;

            localStorage.setItem(
                "darkMode",
                darkMode
            );

            updateTheme();

        }
    );

}


updateTheme();


// ====================
// Dashboard
// ====================

function updateDashboard() {

    const totalTasks =
        document.getElementById(
            "totalTasks"
        );

    const completedTasks =
        document.getElementById(
            "completedTasks"
        );

    const totalExpenses =
        document.getElementById(
            "totalExpenses"
        );

    const activeGoals =
        document.getElementById(
            "activeGoals"
        );


    totalTasks.textContent =
        tasks.length;


    completedTasks.textContent =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const expenseSum =
        expenses.reduce(
            (total, expense) =>
                total +
                Number(expense.amount),
            0
        );


    totalExpenses.textContent =
        `₹${expenseSum}`;


    activeGoals.textContent =
        goals.filter(
            goal =>
                Number(goal.progress) < 100
        ).length;


    updateDashboardTasks();

    updateDashboardGoals();

    updateDashboardExpenses();

    updateDashboardNotes();

}


// ====================
// Dashboard Tasks
// ====================

function updateDashboardTasks() {

    const dashboardTasks =
        document.getElementById(
            "dashboardTasks"
        );

    if (!dashboardTasks) {
        return;
    }

    const recentTasks =
        tasks.slice(-3).reverse();

    if (recentTasks.length === 0) {

        dashboardTasks.innerHTML = `
            <p class="empty-message">
                No tasks added yet.
            </p>
        `;

        return;
    }

    dashboardTasks.innerHTML =
        recentTasks.map(task => `

            <div class="task-item">

                <div class="task-info">

                    <input
                        type="checkbox"
                        ${task.completed ? "checked" : ""}
                        disabled
                    >

                    <div class="task-details">

                        <h4>${task.title}</h4>

                        <p>
                            ${task.category} •
                            ${task.priority}
                        </p>

                    </div>

                </div>

            </div>

        `).join("");

}


// ====================
// Dashboard Goals
// ====================

function updateDashboardGoals() {

    const dashboardGoals =
        document.getElementById(
            "dashboardGoals"
        );

    if (!dashboardGoals) {
        return;
    }

    const recentGoals =
        goals.slice(-3).reverse();

    if (recentGoals.length === 0) {

        dashboardGoals.innerHTML = `
            <p class="empty-message">
                No goals added yet.
            </p>
        `;

        return;
    }

    dashboardGoals.innerHTML =
        recentGoals.map(goal => `

            <div class="goal-preview-item">

                <div>

                    <strong>
                        ${goal.name}
                    </strong>

                    <span>
                        ${goal.progress}%
                    </span>

                </div>

                <div class="goal-progress">

                    <div
                        class="goal-progress-bar"
                        style="width: ${goal.progress}%"
                    ></div>

                </div>

            </div>

        `).join("");

}


// ====================
// Dashboard Expenses
// ====================

function updateDashboardExpenses() {

    const dashboardExpenses =
        document.getElementById(
            "dashboardExpenses"
        );

    if (!dashboardExpenses) {
        return;
    }

    const recentExpenses =
        expenses.slice(-3).reverse();

    if (recentExpenses.length === 0) {

        dashboardExpenses.innerHTML = `
            <p class="empty-message">
                No expenses added yet.
            </p>
        `;

        return;
    }

    dashboardExpenses.innerHTML =
        recentExpenses.map(expense => `

            <div class="expense-preview-item">

                <div>

                    <strong>
                        ${expense.category}
                    </strong>

                    <p>
                        ${expense.description || "Expense"}
                    </p>

                </div>

                <strong>
                    ₹${expense.amount}
                </strong>

            </div>

        `).join("");

}


// ====================
// Dashboard Notes
// ====================

function updateDashboardNotes() {

    const dashboardNotes =
        document.getElementById(
            "dashboardNotes"
        );

    if (!dashboardNotes) {
        return;
    }

    const recentNotes =
        notes.slice(-3).reverse();

    if (recentNotes.length === 0) {

        dashboardNotes.innerHTML = `
            <p class="empty-message">
                No notes added yet.
            </p>
        `;

        return;
    }

    dashboardNotes.innerHTML =
        recentNotes.map(note => `

            <div class="note-preview-item">

                <strong>
                    ${note.title}
                </strong>

                <p>
                    ${note.content}
                </p>

            </div>

        `).join("");

}


// ====================
// Initial Load
// ====================

renderTasks();

renderExpenses();

renderGoals();

renderNotes();

updateDashboard();