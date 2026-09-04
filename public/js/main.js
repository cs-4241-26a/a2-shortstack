// FRONT-END (CLIENT) JAVASCRIPT HERE

const loadData = async function() {
  const response = await fetch('/data');
  const data = await response.json();
  renderTable(data);
}

const submit = async function(event) {
  event.preventDefault();
  
  const taskName = document.querySelector('#taskName').value;
  const assignee = document.querySelector('#assignee').value;
  const dueDate = document.querySelector('#dueDate').value;
  
  const body = JSON.stringify({ taskName, assignee, dueDate });

  const response = await fetch('/submit', {
    method: 'POST',
    body
  });

  const data = await response.json();
  renderTable(data);
}

const renderTable = function(data) {
  const tbody = document.querySelector('#results');
  tbody.innerHTML = '';
  
  data.forEach(task => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${task.taskName}</td>
      <td>${task.assignee}</td>
      <td>${task.dueDate}</td>
      <td>${task.daysRemaining}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit
}
