const taskForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center p-3 rounded-lg shadow 
                    ${task.completed ? 'bg-green-100 line-through text-gray-500' : 'bg-gray-100'}`;
        li.textContent = task.text;

        const btnContainer = document.createElement('div');

        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔';
        completeBtn.className = "text-green-600 hover:text-green-800 font-bold mr-2";
        completeBtn.onclick = () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        };

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑';
        deleteBtn.className = "text-red-600 hover:text-red-800 font-bold";
        deleteBtn.onclick = () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        btnContainer.appendChild(completeBtn);
        btnContainer.appendChild(deleteBtn);
        li.appendChild(btnContainer);
        taskList.appendChild(li);
    });
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = { text: taskInput.value, completed: false };
    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
});

renderTasks();
