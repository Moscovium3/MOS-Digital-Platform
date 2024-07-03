document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskText }),
            });

            if (response.ok) {
                const task = await response.json();
                addTaskToDOM(task);
                taskInput.value = '';
            }
        }
    });

    async function fetchTasks() {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        tasks.forEach(addTaskToDOM);
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.dataset.id = task.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', async () => {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                li.remove();
            }
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    fetchTasks();
});
