////// DOM elements
const taskBoards = document.getElementsByClassName('task-list');
const taskItems = document.querySelectorAll('.task');
const mainContainer = document.getElementById('board-container');
const addBoardBtn = document.getElementById('add-board-btn');
const allBoards = document.querySelectorAll('.board');
const themeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

////// Functions

// Change theme
function changeTheme() {
  body.classList.toggle('dark-mode');
  if(body.classList.contains('dark-mode')){
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }else{
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Add new boards
function AddNewBoard() {
  const board = document.createElement('section');
  board.classList.add('board');
  let boardHeading = prompt('Write the Heading of the board');
  if (boardHeading === null) return;
  let trimmedHeading = boardHeading.trim();
  if (trimmedHeading === '') {
    alert('Give a valid board heading');
    return;
  }

  let boardId = trimmedHeading.replace(/\s/g, '').toLowerCase();
  board.innerHTML = `
    <div class="board-header">
      <h2>${boardHeading}</h2>
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
// Edit board
function editBoard(boardElement) {
  const boardHeading = boardElement.querySelector('h2');
  let newHeading = prompt(
    'Edit board heading:',
    boardHeading.textContent || ''
  );
  if (newHeading === null) return;
  let trimmedHeading = newHeading.trim();
  if (trimmedHeading === '') {
    alert('Give a valid board heading');
    return;
  }
  boardHeading.textContent = trimmedHeading;
}

// Delete board
function deleteBoard(boardElement) {
  if (confirm('Are you sure you want to delete this board?')) {
    boardElement.remove();
  }
}

// Add new Task
function addNewTask(boardId) {
  const taskInputField = document.getElementById(`${boardId}-input`);
  const taskText = taskInputField.value.trim();
  if (taskText === '') return;

  const newTaskElement = createTaskElement(taskText);
  document.getElementById(boardId).appendChild(newTaskElement);

  enableDragEvents(newTaskElement);

  taskInputField.value = '';
}

// Delete Specific task
function deleteTask(taskElement) {
  if (taskElement) {
    taskElement.remove();
  }
}

// Edit task
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

// create the task card
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

  return taskContainer;
}

// Get the current time
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

// enable drag event
function enableDragEvents(target) {
  target.addEventListener('dragstart', () => {
    target.classList.add('dragging');
  });
  target.addEventListener('dragend', () => {
    target.classList.remove('dragging');
  });
}

function enableDropEvents(taskBoard) {
  // When a dragged task is hovering over a task board.
  taskBoard.addEventListener('dragover', e => {
    e.preventDefault();
    const draggedTask = document.querySelector('.dragging');
    if (draggedTask) {
      taskBoard.classList.add('drag-over');
    }
  });

  // When dragged task leaves the task board.
  taskBoard.addEventListener('dragleave', () => {
    taskBoard.classList.remove('drag-over');
  });

  // When the user releases the dragged task.
  taskBoard.addEventListener('drop', () => {
    taskBoard.classList.remove('drag-over');
    const draggedTask = document.querySelector('.dragging');
    if (draggedTask) {
      taskBoard.appendChild(draggedTask);
    }
  });
}

////// Event Literatures

// Change theme
const currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches?'dark':'light';
if(currentTheme === 'dark'){
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
themeToggle.addEventListener('click', changeTheme);

taskItems.forEach(enableDragEvents);
Array.from(taskBoards).forEach(enableDropEvents);

// Add event listeners for existing board edit and delete icons
allBoards.forEach(board => {
  const editBoardIcon = board.querySelector('.edit-board-icon');
  const deleteBoardIcon = board.querySelector('.delete-board-icon');

  editBoardIcon.addEventListener('click', () => editBoard(board));
  deleteBoardIcon.addEventListener('click', () => deleteBoard(board));
});

addBoardBtn.addEventListener('click', AddNewBoard);
