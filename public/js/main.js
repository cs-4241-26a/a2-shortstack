// FRONT-END (CLIENT) JAVASCRIPT HERE

const form = document.querySelector('#task-form')
const taskList = document.querySelector('#task-list')

const displayTasks = function(tasks) {
  taskList.innerHTML = tasks.map(item => `
    <tr>
      <td>${item.task}</td>
      <td>${item.creationDate}</td>
      <td>${item.deadline}</td>
      <td>${item.status}</td>
      <td>${item.timeToComplete}</td>
      <td><button class="delete-button" data-id="${item.id}">Delete</button></td>
    </tr>
  `).join('')
}

const loadTasks = async function() {
  const response = await fetch('/data')
  displayTasks(await response.json())
}
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const formData = Object.fromEntries(new FormData(form))
  const body = JSON.stringify(formData)

  const response = await fetch( '/data', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })

  displayTasks(await response.json())
  form.reset()
}

form.addEventListener('submit', submit)
taskList.addEventListener('click', async function(event) {
  if (!event.target.classList.contains('delete-button')) return

  const response = await fetch(`/delete/${event.target.dataset.id}`, {
    method: 'DELETE'
  })
  displayTasks(await response.json())
})

loadTasks()