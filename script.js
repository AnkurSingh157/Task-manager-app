const taskInput = document.getElementById('task-input');
const taskDeadline = document.getElementById('task-deadline');
const taskPriority = document.getElementById('task-priority');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterPriority = document.getElementById('filter-priority');
const filterStatus = document.getElementById('filter-status');
const progressBar = document.getElementById('progress');
const toggleSwitch = document.getElementById('toggle');

addTaskBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
toggleSwitch.addEventListener('change', toggleTheme);
filterPriority.addEventListener('change', filterTasks);
filterStatus.addEventListener('change', filterTasks);

function addTask() {
    const text = taskInput.value;
    const deadline = taskDeadline.value;
    const priority = taskPriority.value;

    if (!text) return;

    saveTask(text, priority, deadline);
    taskInput.value = '';
    taskDeadline.value = '';
    updateTasks();
}

function saveTask(text, priority, deadline) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, priority, deadline, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTasks() {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedCount = 0;

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <small>Deadline: ${task.deadline}</small>
            <span class="priority ${task.priority}">${task.priority} Priority</span>
            <button onclick="toggleComplete('${task.text}')">✔️</button>
        `;

        if (task.completed) {
            taskItem.classList.add('completed');
            completedCount++;
        }

        taskList.appendChild(taskItem);
    });

    updateProgressBar(tasks.length, completedCount);
}

function toggleComplete(text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.text === text);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTasks();
}

function clearCompletedTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    updateTasks();
}

function updateProgressBar(total, completed) {
    const progress = total ? (completed / total) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function filterTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => {
        const priorityMatch = filterPriority.value === 'All' || task.priority === filterPriority.value;
        const statusMatch = filterStatus.value === 'All' || (filterStatus.value === 'Completed' ? task.completed : !task.completed);
        return priorityMatch && statusMatch;
    });

    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <small>Deadline: ${task.deadline}</small>
            <span class="priority ${task.priority}">${task.priority} Priority</span>
            <button onclick="toggleComplete('${task.text}')">✔️</button>
        `;
        if (task.completed) taskItem.classList.add('completed');
        taskList.appendChild(taskItem);
    });

    updateProgressBar(filteredTasks.length, filteredTasks.filter(task => task.completed).length);
}

// Initial load
updateTasks();
