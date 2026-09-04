// FRONT-END (CLIENT) JAVASCRIPT HERE

// Function to clear the table and rebuild it from lifts array
// Called after every load/add/delete (server always sends back full array)
const renderTable = function (lifts) {
  const tbody = document.querySelector("#lifts-body");

  // Clears table
  tbody.replaceChildren();

  // Creates new table
  for (const lift of lifts) {

    // Table elements
    const tableRow = document.createElement("tr");
    const tdExercise = document.createElement("td");
    const tdWeight = document.createElement("td");
    const tdReps = document.createElement("td");
    const tdORM = document.createElement("td");
    const tdDeleteButton = document.createElement("td");
    const deleteButton = document.createElement("button"); // Delete button, unique to lift.ID
    tdDeleteButton.appendChild(deleteButton);

    // Setting textContent to lift's data (and button)
    tdExercise.textContent = lift.exercise;
    tdWeight.textContent = lift.weight;
    tdReps.textContent = lift.reps;
    tdORM.textContent = lift.orm;
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-delete"); // Add classes to delete button

    // Event listener for delete button
    deleteButton.addEventListener('click', function () { deleteLift(lift.ID) });

    // Appends everything to tableRow
    tableRow.append(tdExercise, tdWeight, tdReps, tdORM, tdDeleteButton);

    // Appends table row to tbody
    tbody.appendChild(tableRow);
  }
} 

// Function to fetch "/lifts", parse JSON response, render table
// Called on page load
const fetchLifts = async function () {
  const response = await fetch("/lifts", {
    method: "GET"
  });

  const lifts = await response.json();
  renderTable(lifts);
}

// Function to handle form submission for adding a new lift
// Called by #lift-form submit handler
const addLift = async function (event) {
  event.preventDefault()

  // Input elements
  const exerciseInput = document.getElementById("exercise"); // Using .getElementById() here 
  const weightInput = document.querySelector("#weight"); // Using .querySelector() here
  const repsInput = document.querySelector("#reps"); // Using .querySelector() here

  // Reading input values (converting string -> number for numeric ones)
  const exercise = exerciseInput.value;
  const weight = Number(weightInput.value);
  const reps = Number(repsInput.value);

  const body = JSON.stringify({ exercise, weight, reps });

  // POST to /addLift with { exercise, weight, reps }
  const response = await fetch("/addLift", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  });

  const lifts = await response.json();
  renderTable(lifts);

  // Clears the form inputs back to empty
  exerciseInput.value = "";
  weightInput.value = "";
  repsInput.value = "";
}

// Function to handle deleting a lift by ID
// Called by a delete button's click handler with that lift's ID
const deleteLift = async function (ID) {
  const body = JSON.stringify({ ID });

  // POST to /deleteLift with { ID: id }
  const response = await fetch("/deleteLift", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  });

  const lifts = await response.json();
  renderTable(lifts);
}

// Function to handle page load events
// Called when the page loads
window.onload = function () {
  // Fill table with any lifts already in the server on load
  fetchLifts();

  // Attach addLift as the #lift-form submit handler
  const liftForm = document.getElementById("lift-form");
  liftForm.addEventListener("submit", addLift);  
}