// FRONT-END (CLIENT) JAVASCRIPT HERE

let notes = [];
let editIndex = null; // Track which note is being edited

// INITIALIZE DOM VARIABLES
const modal = document.getElementById('noteModal');
const openModalBtn = document.getElementById('addNote');
const cancelBtn = document.getElementById('cancelNote');
const form = document.getElementById('noteForm');


// NEW note
openModalBtn.addEventListener('click', () => {
  editIndex = null;
  form.reset();
  document.getElementById('saveNote').innerText = "Save Note";
  modal.style.display = 'flex';
});

// Hide the overlay
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  form.reset();
});

// form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const noteData = {
    title: document.getElementById('noteTitle').value,
    content: document.getElementById('noteContent').value,
    urgency: document.getElementById('noteUrgency').value
  };

  if (editIndex !== null) {
    // EDITING Note
    noteData.index = editIndex;
    const response = await fetch('/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    notes = await response.json();
  } else {
    // ADDING new note
    const response = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    notes = await response.json();
  }

  modal.style.display = 'none';
  form.reset();
  renderNotes();
});

// EXISTING note
window.editNote = function(index) {
  editIndex = index;
  const note = notes[index];

  // Pre-fill the form
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('noteContent').value = note.content;
  document.getElementById('noteUrgency').value = note.urgency;

  document.getElementById('saveNote').innerText = "Update Note";
  modal.style.display = 'flex';
};

async function deleteNote(index) {
  const response = await fetch('/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  });

  notes = await response.json();
  renderNotes();
}

// fetch notes from server
async function fetchNotes() {
  const response = await fetch('/notes');
  notes = await response.json();
  renderNotes();
}

// render HTML
function renderNotes() {
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  notes.forEach((note, index) => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');

    noteDiv.innerHTML = `
        <h3 style="color: #333; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">${note.title}</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 10px; text-transform: capitalize; font-family: 'Montserrat', sans-serif;">
          Urgency: ${note.urgency} | Due: <strong>${note.deadline}</strong>
        </p>
        <textarea readonly>${note.content}</textarea>
        <div style="position: absolute; top: 5px; right: 5px; display: flex; gap: 5px;">
          <button style="background: var(--button-color); color: white; border: none; padding: 5px; cursor: pointer; border-radius: 4px;" onclick="editNote(${index})">Edit</button>
          <button style="background: #DA4167; color: white; border: none; padding: 5px; cursor: pointer; border-radius: 4px;" onclick="deleteNote(${index})">X</button>
        </div>
    `;
    container.appendChild(noteDiv);
  });
}

// INITIALIZE APP ON LOAD
window.onload = fetchNotes;