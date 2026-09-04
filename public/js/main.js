// change date into a YYYY-MM-DD string
const todayAsString = function() {
  const now = new Date()
  return now.toISOString().split( 'T' )[ 0 ]
}

const renderTasks = function( tasks ) {
  const tableBody = document.querySelector( '#task-table-body' )

  // clear out whatever rows are there
  tableBody.innerHTML = ''

  tasks.forEach( function( task ) {
    const row = document.createElement( 'tr' )

    row.innerHTML =
      '<td>' + task.task + '</td>' +
      '<td class="priority-' + task.priority + '">' + task.priority + '</td>' +
      '<td>' + task.created + '</td>' +
      '<td>' + task.deadline + '</td>' +
      '<td><button class="delete-button" data-id="' + task.id + '">delete</button></td>'

    tableBody.appendChild( row )
  })

  // wire up delete buttons created
  const deleteButtons = document.querySelectorAll( '.delete-button' )
  deleteButtons.forEach( function( btn ) {
    btn.onclick = function() {
      submit( Number( btn.dataset.id ) )
    }
  })
}

// display current tasks list
const loadTasks = async function() {
  const response = await fetch( '/data' )
  const tasks = await response.json()
  renderTasks( tasks )
}

// add task to server
const addTask = async function( event ) {
  event.preventDefault() 

  const taskInput = document.querySelector( '#task' )
  const priorityInput = document.querySelector( '#priority' )

  const newTask = {
    task: taskInput.value,
    priority: priorityInput.value,
    created: todayAsString()
  }

  const response = await fetch( '/add', {
    method: 'POST',
    body: JSON.stringify( newTask )
  })

  const updatedTasks = await response.json()
  renderTasks( updatedTasks )

  taskInput.value = ''
  priorityInput.value = 'medium'
}

// redraw task list after deleting a task
const submit = async function( id ) {
  const response = await fetch( '/delete', {
    method: 'POST',
    body: JSON.stringify( { id: id } )
  })

  const updatedTasks = await response.json()
  renderTasks( updatedTasks )
}

window.onload = function() {
  loadTasks()

  const form = document.querySelector( '#task-form' )
  form.onsubmit = addTask
}
