// FRONT-END (CLIENT) JAVASCRIPT HERE

function loadCarList(carList) {
  const oldCarListElement = document.getElementById('to-do-list')
  if (oldCarListElement) document.body.removeChild(oldCarListElement)
  const carListElement = document.createElement('ul')
  carListElement.id = 'to-do-list'
  for (const item of carList) {
    const carItemElement = document.createElement('li')
    carItemElement.innerText = `${item.year} ${item.model} (${item.mpg} MPG)`
    carListElement.appendChild(carItemElement)

    carItemElement.addEventListener('click', async function(event) {
      const carItemEditElement = document.createElement('form')

      const editYearLabel = document.createElement('label')
      const editYearInput = document.createElement('input')
      editYearInput.type = 'text'
      editYearInput.id = 'edit-year-input'
      editYearInput.value = item.year
      editYearLabel.innerText = 'Year'
      editYearLabel.appendChild(editYearInput)
      carItemEditElement.appendChild(editYearLabel)

      const editModelLabel = document.createElement('label')
      const editModelInput = document.createElement('input')
      editModelInput.type = 'text'
      editModelInput.id = 'edit-model-input'
      editModelInput.value = item.model
      editModelLabel.innerText = 'Model'
      editModelLabel.appendChild(editModelInput)
      carItemEditElement.appendChild(editModelLabel)

      const editMpgLabel = document.createElement('label')
      const editMpgInput = document.createElement('input')
      editMpgInput.type = 'text'
      editMpgInput.id = 'edit-mpg-input'
      editMpgInput.value = item.mpg
      editMpgLabel.innerText = 'MPG'
      editMpgLabel.appendChild(editMpgInput)
      carItemEditElement.appendChild(editMpgLabel)

      const editSubmitButton = document.createElement('button')
      editSubmitButton.addEventListener('click', async function(event) {
        event.preventDefault()
        const editJson = {
          id: item.id,
          year: editYearInput.value,
          model: editModelInput.value,
          mpg: editMpgInput.value
        }
        const editBody = JSON.stringify(editJson)
        const editResponse = await fetch('/submit', {
          method: 'PUT',
          body: editBody
        })
        const newCarList = JSON.parse(await editResponse.text())
        console.log(newCarList)
        loadCarList(newCarList)
      })
      editSubmitButton.innerText = 'submit'
      carItemEditElement.appendChild(editSubmitButton)

      carItemElement.replaceWith(carItemEditElement)
    })

    const deleteItemButton = document.createElement('button')
    deleteItemButton.type = 'button'
    deleteItemButton.textContent = 'delete'
    deleteItemButton.addEventListener('click', async function(event) {
      event.preventDefault()
      const deleteBody = JSON.stringify(item)
      const deleteResponse = await fetch( '/submit', {
        method: 'DELETE',
        body: deleteBody
      })
      const newCarList = JSON.parse(await deleteResponse.text())
      console.log(newCarList)
      loadCarList(newCarList)
    })
    carItemElement.appendChild(deleteItemButton)
  }
  document.body.appendChild(carListElement)
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const yearInput = document.getElementById('year-input'),
        modelInput = document.getElementById('model-input'),
        mpgInput = document.getElementById('mpg-input')
  const json = { 
    model: modelInput.value,
    year: yearInput.value,
    mpg: mpgInput.value
  }
  const body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()
  const carList = JSON.parse(text)
  console.log(carList)
  
  loadCarList(carList)
  yearInput.value = ''
  modelInput.value = ''
  mpgInput.value = ''
}

window.onload = async function() {
  const button = document.querySelector('button')
  button.onclick = submit
  
  const response = await fetch( '/submit', {
    method: 'GET'
  })
  const text = await response.text()
  const carList = JSON.parse(text)
  console.log(carList)
  loadCarList(carList)
}
