//////////// DOM elements
const taskBoards = document.getElementsByClassName('task-list');
const allTask = document.getElementsByClassName('task');
const taskItems = document.querySelectorAll('.task');
const mainContainer = document.getElementById('board-container');
const addBoardBtn = document.getElementById('add-board-btn');
const allBoards = document.querySelectorAll('.board');
const themeToggle = document.getElementById('dark-mode-toggle');
const body = document.body; // Get the body element

//////////// Functions

// Change theme between dark and light mode
function changeTheme() {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Open modal
function showBoardCreationModal() {
  document.getElementById('board-model').style.display = 'block';
}

// Close modal
function closeBoardModel() {
  document.getElementById('board-model').style.display = 'none';
}

// Handle board creation from modal
function createBoardFromModal() {
  const board = document.getElementById('board-name-input');
  const boardColour = document.getElementById('board-color-input').value;
  const boardHeading = board.value.trim();
  if (boardHeading === null) {
    alert('Please enter a board name');
    return;
  } else if (boardHeading === '') {
    alert('Give a valid board heading');
    return;
  }
  addNewBoard(boardHeading, boardColour);

  board.value = '';
  closeBoardModel();
}

// Add new boards to the main container
function addNewBoard(boardHeading, boardColour) {
  const board = document.createElement('section');
  board.classList.add('board');
  board.setAttribute('data-color', boardColour);
  if (boardHeading === null) return;
  let trimmedHeading = boardHeading.trim();
  if (trimmedHeading === '') {
    alert('Give a valid board heading');
    return;
  }

  let boardId = trimmedHeading.replace(/\s/g, '').toLowerCase();
  board.innerHTML = `
    <div class="board-header">
      <h2>
      <span class="color-dot" style="background-color: ${boardColour};"></span>
      ${boardHeading} <span id="${boardId}-count" class="task-count">0</span> </h2>
      <div class="board-actions">
        <i class="fas fa-edit edit-board-icon"></i>
        <i class="fas fa-trash delete-board-icon"></i>
      </div>
    </div>
    <div id="${boardId}" class="task-list"></div>
    <input type="text" class="task-input" id="${boardId}-input" placeholder="Enter a new task">
    <button class="add-task-btn" onclick="addNewTask('${boardId}')">+ Add Task</button>
  `;
  mainContainer.appendChild(board);

  const editIcon = board.querySelector('.edit-board-icon');
  const deleteIcon = board.querySelector('.delete-board-icon');

  editIcon.addEventListener('click', () => editBoard(board));
  deleteIcon.addEventListener('click', () => deleteBoard(board));

  enableDropEvents(document.getElementById(boardId));
}

// Edit the heading of a board
function editBoard(boardElement) {
  const boardHeading = boardElement.querySelector('h2');
  let newHeading = prompt('Edit board heading:'); // Prompt user for new heading
  if (newHeading === null) return;
  let trimmedHeading = newHeading.trim();
  if (trimmedHeading === '') {
    alert('Give a valid board heading');
    return;
  }
  boardHeading.textContent = trimmedHeading;
}

// Delete a board
function deleteBoard(boardElement) {
  if (confirm('Are you sure you want to delete this board?')) {
    boardElement.remove();
  }
}

// Add a new task to a board
function addNewTask(boardId) {
  const taskInputField = document.getElementById(`${boardId}-input`);
  const taskText = taskInputField.value.trim();
  if (taskText === '') return;

  const newTaskElement = createTaskElement(taskText);
  document.getElementById(boardId).appendChild(newTaskElement);

  const boardSection = newTaskElement.closest('.board');
  const boardColor = boardSection.getAttribute('data-color'); // Fix here
  newTaskElement.style.borderLeft = `6px solid ${boardColor}`;

  enableDragEvents(newTaskElement);

  updateTasksCount(boardId);

  taskInputField.value = '';
}
// Create a task element with text and timestamp
function createTaskElement(text) {
  // Create all elements
  const taskContainer = document.createElement('div');
  const taskDetails = document.createElement('div');
  const taskActions = document.createElement('div');
  const taskTextElement = document.createElement('span');
  const taskTimestamp = document.createElement('span');
  const editButton = document.createElement('i');
  const deleteButton = document.createElement('i');

  // Set text content
  taskTextElement.textContent = text;
  taskTimestamp.textContent = getFormattedTime();

  // Append elements
  taskContainer.appendChild(taskDetails);
  taskContainer.appendChild(taskActions);
  taskDetails.appendChild(taskTextElement);
  taskDetails.appendChild(taskTimestamp);
  taskActions.appendChild(editButton);
  taskActions.appendChild(deleteButton);

  // Add classes
  taskContainer.classList.add('task');
  taskDetails.classList.add('task-content');
  taskActions.classList.add('task-actions');
  taskTextElement.classList.add('task-text');
  taskTimestamp.classList.add('task-date');
  editButton.classList.add('fas', 'fa-edit', 'edit-icon');
  deleteButton.classList.add('fas', 'fa-trash', 'delete-icon');

  // Make task draggable
  taskContainer.draggable = true;

  // Add event listeners for edit and delete icons
  editButton.addEventListener('click', () => editTask(taskContainer));
  deleteButton.addEventListener('click', () => deleteTask(taskContainer));

  return taskContainer; // Return the created task element
}

// Delete a specific task
function deleteTask(taskElement) {
  if (taskElement) {
    const boardElement = taskElement.closest('.task-list');
    const boardId = boardElement.id;
    taskElement.remove();
    updateTasksCount(boardId);
  }
}

// Edit a task
function editTask(taskElement) {
  let target = taskElement.children[0].children[0];
  let editedText = prompt('Edit your task:', target.textContent || '');
  if (editedText === null) return;
  let trimmedText = editedText.trim();
  if (trimmedText === '') {
    alert('Give a valid task name');
    return;
  }
  target.textContent = trimmedText;
}

// Get the current time in a formatted string
function getFormattedTime() {
  let d = new Date();
  let dateStr = `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d
    .getHours()
    .toString()
    .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  return dateStr;
}

// Enable drag events for a task element
function enableDragEvents(target) {
  target.addEventListener('dragstart', () => {
    target.classList.add('dragging');
  });
  target.addEventListener('dragend', () => {
    target.classList.remove('dragging');
    document.querySelectorAll('.task-list').forEach(task => {
      const boardId = task.id;
      updateTasksCount(boardId);
    });
  });
}

// Enable drop events for a task board
function enableDropEvents(taskBoard) {
  // When a dragged task is hovering over a task board
  taskBoard.addEventListener('dragover', e => {
    e.preventDefault();
    const draggedTask = document.querySelector('.dragging');
    if (draggedTask) {
      taskBoard.classList.add('drag-over');
    }
  });

  // When dragged task leaves the task board
  taskBoard.addEventListener('dragleave', () => {
    taskBoard.classList.remove('drag-over');
  });

  // When the user releases the dragged task
  taskBoard.addEventListener('drop', () => {
    taskBoard.classList.remove('drag-over');
    const boardSection = taskBoard.closest('.board');
    const boardColor = boardSection.getAttribute('data-color');
    const draggedTask = document.querySelector('.dragging');
    if (draggedTask) {
      taskBoard.appendChild(draggedTask);
      draggedTask.style.borderLeft = `6px solid ${boardColor}`;
    }
  });
}

// Update the task count for a specific board
function updateTasksCount(boardId) {
  const count = document.querySelectorAll(`#${boardId} .task`).length;
  document.getElementById(`${boardId}-count`).textContent = count;
}

//////////// Event Listeners

// Set initial theme based on user's system preference
const currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
themeToggle.addEventListener('click', changeTheme);

// Enable drag events for all existing task items
taskItems.forEach(enableDragEvents);

// Enable drop events for all existing task boards
Array.from(taskBoards).forEach(enableDropEvents);

// Add event listeners for existing board edit and delete icons
allBoards.forEach(board => {
  const editBoardIcon = board.querySelector('.edit-board-icon');
  const deleteBoardIcon = board.querySelector('.delete-board-icon');

  editBoardIcon.addEventListener('click', () => editBoard(board));
  deleteBoardIcon.addEventListener('click', () => deleteBoard(board));
});

// Check the task count, and add edit and delete button eventlistuner in already present task when the page loads
document.addEventListener('DOMContentLoaded', () => {
  Array.from(taskBoards).forEach(board => {
    // update the count of tasks for the board
    let boardId = board.id;
    updateTasksCount(boardId);
    // add border colour of the task
    const tasks = board.querySelectorAll('.task');
    tasks.forEach(task => {
      const board = task.closest('.board');
      task.style.borderLeftColor = board.getAttribute('data-color');
    });
  });
  Array.from(allTask).forEach(task => {
    task
      .querySelector('.edit-icon')
      .addEventListener('click', () => editTask(task));
    task
      .querySelector('.delete-icon')
      .addEventListener('click', () => deleteTask(task));
  });
});
