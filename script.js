const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton'); // Correct ID
const taskList = document.getElementById('taskList');

addTaskButton.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.textContent = taskText;
        taskList.appendChild(li);
        taskInput.value = '';
    } else {
        alert('Please enter a task');
    }
});


// script.js
// Example: Smooth scroll or nav highlight (optional)

