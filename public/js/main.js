// getting the dataset, add it to the page
const loadData = async function() {
  const response = await fetch( '/data' )
  const todos = await response.json()
  render( todos )
}

// send post to server and send it back for redraw
const postData = async function( url, json ) {
  const response = await fetch( url, {
    method: 'POST',
    body: JSON.stringify( json )
  })

  const result = await response.json()

  const message = document.querySelector( '#message' )
  if( result.error !== null ) {
    message.textContent = result.error
  } 
  
  else {
    message.textContent = ''
  }

  render( result.todos )
}

// grab input task
const submit = function( event ) {
  event.preventDefault()

  const task = document.querySelector( '#task' ),
        priority = document.querySelector( '#priority' )

  postData( '/add', { task: task.value, priority: priority.value } )

  task.value = ''
}

// draw the three lists
const render = function( todos ) {
  const openList = document.querySelector( '#open' ),
        closedList = document.querySelector( '#closed' ),
        doneList = document.querySelector( '#done' )

  openList.innerHTML = ''
  closedList.innerHTML = ''
  doneList.innerHTML = ''

  for( let i = 0; i < todos.length; i++ ) {
    const todo = todos[ i ]
    const item = makeItem( todo )

    if( todo.list === 'open' ) {
      openList.appendChild( item )
    }
    
    else if( todo.list === 'closed' ) {
      closedList.appendChild( item )
    } 
    
    else {
      doneList.appendChild( item )
    }
  }
}

// build one <li> for one task
const makeItem = function( todo ) {
  const item = document.createElement( 'li' )
  item.className = 'item'

  const text = document.createElement( 'div' )
  text.className = 'task-text'
  text.textContent = todo.task + ' (' + todo.priority + ', due ' + todo.deadline + ')'
  item.appendChild( text )

  const buttons = document.createElement( 'div' )
  buttons.className = 'buttons'

  // changing buttons depending on which list
  if( todo.list === 'open' ) {
    buttons.appendChild( makeButton( 'Start', function() {
      postData( '/move', { id: todo.id, list: 'closed' } )
    }))
  }
  
  else if( todo.list === 'closed' ) {
    buttons.appendChild( makeButton( 'Done', function() {
      postData( '/move', { id: todo.id, list: 'done' } )
    }))
    buttons.appendChild( makeButton( 'Back', function() {
      postData( '/move', { id: todo.id, list: 'open' } )
    }))
  } 
  
  else {
    buttons.appendChild( makeButton( 'Reopen', function() {
      postData( '/move', { id: todo.id, list: 'open' } )
    }))
  }

  // editing task text (can occur to all items)
  buttons.appendChild( makeButton( 'Edit', function() {
    const newTask = window.prompt( 'Edit task:', todo.task )
    if( newTask !== null && newTask !== '' ) {
      postData( '/edit', { id: todo.id, task: newTask } )
    }
  }))

  // deleting items (can occur to all items)
  buttons.appendChild( makeButton( 'Delete', function() {
    postData( '/delete', { id: todo.id } )
  }))

  item.appendChild( buttons )
  return item
}

// helper to make a button
const makeButton = function( label, action ) {
  const button = document.createElement( 'button' )
  button.textContent = label
  button.onclick = action
  return button
}

window.onload = function() {
  const form = document.querySelector( '#addForm' )
  form.onsubmit = submit

  loadData()
}
