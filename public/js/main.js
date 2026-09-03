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

    const deleteItemButton = document.createElement('button')
    deleteItemButton.type = 'button'
    deleteItemButton.textContent = 'delete'
    deleteItemButton.addEventListener('click', async function(event) {
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
