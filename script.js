////// DOM elements
const taskBoards = document.querySelectorAll('.task-list');
const taskItems = document.querySelectorAll('.task');
////// Functions

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
  editButton.classList.add('fas', 'fa-edit', 'edit-icon'); // Add classes separately
  deleteButton.classList.add('fas', 'fa-trash', 'delete-icon'); // Add classes separately

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

////// Event Literatures
taskItems.forEach(enableDragEvents);

function enableDragEvents(target) {
  target.addEventListener('dragstart', () => {
    target.classList.add('dragging');
  });
  target.addEventListener('dragend', () => {
    target.classList.remove('dragging');
  });
}

taskBoards.forEach(taskBoard => {
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
});
