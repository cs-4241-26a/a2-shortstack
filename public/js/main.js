let editingId = null

const formatDate = function( isoString ) {
  const d = new Date( isoString )
  return d.toLocaleDateString( undefined, { month: 'short', day: 'numeric', year: 'numeric' } )
}

const render = function( tasks ) {
  const tbody = document.querySelector( '#task-table-body' )
  const emptyMessage = document.querySelector( '#empty-message' )

  tbody.innerHTML = ''

  if( tasks.length === 0 ) {
    emptyMessage.hidden = false
  } else {
    emptyMessage.hidden = true
  }

  tasks.forEach( function( row ) {
    const tr = document.createElement( 'tr' )
    tr.dataset.id = row.id

    if( row.id === editingId ) {
      tr.classList.add( 'editing-row' )
      tr.innerHTML = `
        <td><input type='text' class='edit-task' value="${ escapeHtml( row.task ) }" /></td>
        <td>
          <select class='edit-priority'>
            <option value='low' ${ row.priority === 'low' ? 'selected' : '' }>Low</option>
            <option value='medium' ${ row.priority === 'medium' ? 'selected' : '' }>Medium</option>
            <option value='high' ${ row.priority === 'high' ? 'selected' : '' }>High</option>
          </select>
        </td>
        <td>${ formatDate( row.created ) }</td>
        <td>${ formatDate( row.deadline ) }</td>
        <td class='actions-col'>
          <button class='action-btn save-btn' data-id='${ row.id }'>Save</button>
          <button class='action-btn cancel-btn' data-id='${ row.id }'>Cancel</button>
        </td>
      `
    } else {
      tr.innerHTML = `
        <td>${ escapeHtml( row.task ) }</td>
        <td><span class='priority-pill priority-${ row.priority }'>${ row.priority }</span></td>
        <td>${ formatDate( row.created ) }</td>
        <td>${ formatDate( row.deadline ) }</td>
        <td class='actions-col'>
          <button class='action-btn edit-btn' data-id='${ row.id }'>Edit</button>
          <button class='action-btn delete-btn' data-id='${ row.id }'>Delete</button>
        </td>
      `
    }

    tbody.appendChild( tr )
  })
}

const escapeHtml = function( str ) {
  const div = document.createElement( 'div' )
  div.textContent = str
  return div.innerHTML
}

const loadTasks = async function() {
  const response = await fetch( '/tasks' )
  const tasks = await response.json()
  render( tasks )
}

const addTask = async function( event ) {
  event.preventDefault()

  const taskInput = document.querySelector( '#task-input' )
  const priorityInput = document.querySelector( '#priority-input' )
  const errorMessage = document.querySelector( '#form-error' )

  const json = { task: taskInput.value, priority: priorityInput.value }

  const response = await fetch( '/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( json )
  })

  if( !response.ok ) {
    errorMessage.textContent = await response.text()
    errorMessage.hidden = false
    return
  }

  errorMessage.hidden = true
  const tasks = await response.json()
  taskInput.value = ''
  render( tasks )
  taskInput.focus()
}

const deleteTask = async function( id ) {
  const response = await fetch( `/tasks/${ id }`, { method: 'DELETE' } )
  const tasks = await response.json()
  render( tasks )
}

const saveTask = async function( id, task, priority ) {
  const response = await fetch( `/tasks/${ id }`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, priority })
  })
  editingId = null
  const tasks = await response.json()
  render( tasks )
}

// Event delegation: handle clicks on edit / delete / save / cancel
// buttons that get created dynamically inside the table body.
const handleTableClick = function( event ) {
  const target = event.target

  if( target.classList.contains( 'delete-btn' ) ) {
    deleteTask( target.dataset.id )
  } else if( target.classList.contains( 'edit-btn' ) ) {
    editingId = parseInt( target.dataset.id, 10 )
    loadTasks()
  } else if( target.classList.contains( 'cancel-btn' ) ) {
    editingId = null
    loadTasks()
  } else if( target.classList.contains( 'save-btn' ) ) {
    const row = target.closest( 'tr' )
    const task = row.querySelector( '.edit-task' ).value
    const priority = row.querySelector( '.edit-priority' ).value
    saveTask( target.dataset.id, task, priority )
  }
}

window.onload = function() {
  document.querySelector( '#task-form' ).addEventListener( 'submit', addTask )
  document.querySelector( '#task-table-body' ).addEventListener( 'click', handleTableClick )
  loadTasks()
}