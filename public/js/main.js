// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const firstNameInput = document.querySelector('#firstname')
  const lastNameInput = document.querySelector('#lastname')
  const ageInput = document.querySelector('#age')

  const json = {
    firstName : firstNameInput.value,
    lastName : lastNameInput.value,
    age : ageInput.value
  }

  const body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body: body
  })

  const data = await response.json()

  console.log( 'data:', data )
  displayDatabase( data )
  
  firstNameInput.value = ''
  lastNameInput.value = ''
  ageInput.value = ''
}

const displayDatabase = function( data ) {
  const list = document.querySelector('#names')

  list.innerHTML = ''

  data.forEach(function( person ) {
    const item = document.createElement('li')

    item.classList.add('person')

    item.textContent = `${person.firstName} ${person.lastName}, Age: ${person.age}, Birth Year: ${person.birthYear}`
    list.appendChild(item)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('person-buttons')

    const deleteButton = document.createElement('button')

    deleteButton.textContent = 'Delete'
    deleteButton.classList.add('delete-button')

    deleteButton.onclick = async function() {
      const response = await fetch( `/delete/${data.indexOf(person)}`, {
        method: 'DELETE'
      })

      const updatedData = await response.json()
      displayDatabase(updatedData)
    }

    const updateButton = document.createElement('button')
    updateButton.textContent = 'Update'

    updateButton.classList.add('update-button')

    updateButton.onclick = async function() {
      const newFirstName = prompt('Enter new first name:', person.firstName)
      const newLastName = prompt('Enter new last name:', person.lastName)
      const newAge = prompt('Enter new age:', person.age)

      const response = await fetch( `/update/${data.indexOf(person)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName: newFirstName, lastName: newLastName, age: newAge })
      })

      const updatedData = await response.json()
      displayDatabase(updatedData)
    }

    buttonContainer.appendChild(deleteButton)
    buttonContainer.appendChild(updateButton)

    item.appendChild(buttonContainer)

    list.appendChild(item)
  })
}

const loadDatabase = async function() {
  const response = await fetch( '/data' )
  const data = await response.json()
  displayDatabase( data )
}

window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit
  loadDatabase()
}
