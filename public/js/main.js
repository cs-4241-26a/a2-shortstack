// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  event.preventDefault()
  console.log("hiii");
  
  const idInput = document.querySelector( '#phone-id' )
  const modelInput = document.querySelector( '#model' )
  const yearInput = document.querySelector( '#year' )
  const storageInput = document.querySelector( '#storage' )
  const priceInput = document.querySelector( '#price' )

  const action = idInput.value ? 'modify' : 'add'

  const data = {
    id: idInput.value ? parseInt(idInput.value) : null,
    model: modelInput.value,
    year: parseInt(yearInput.value),
    storage: storageInput.value,
    price: parseFloat(priceInput.value),
  }

  console.log(priceInput);
  const json = { action, data }
  const body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const appdata = await response.json()
  updateTable(appdata)
  clearForm()
}

const deletePhone = async function(id) {
  const json = { action: 'delete', id }
  const body = JSON.stringify(json)
  const response = await fetch('/submit', { method: 'POST', body })
  const appdata = await response.json()
  updateTable(appdata)
}

const editPhone = function(id, model, year, storage, price) {
  document.querySelector('#phone-id').value = id
  document.querySelector('#model').value = model
  document.querySelector('#year').value = year
  document.querySelector('#storage').value = storage
  document.querySelector('#price').value = price
  document.querySelector('#submit-btn').textContent = 'Update'
} 

const clearForm = function() {
  document.querySelector('#phone-id').value = ''
  document.querySelector('#model').value = ''
  document.querySelector('#year').value = ''
  document.querySelector('#storage').value = ''
  document.querySelector('#price').value = ''
  document.querySelector('#submit-btn').textContent = 'Submit'
}

const updateTable = function(data) {
  const tbody = document.querySelector('#phone-body')
  tbody.innerHTML = ''
  
  data.forEach(phone => {
    const tr = document.createElement('tr')
    
    const tdModel = document.createElement('td')
    tdModel.textContent = phone.model
    tr.appendChild(tdModel)
    
    const tdYear = document.createElement('td')
    tdYear.textContent = phone.year
    tr.appendChild(tdYear)
    
    const tdStorage = document.createElement('td')
    tdStorage.textContent = phone.storage
    tr.appendChild(tdStorage)

    const tdPrice = document.createElement('td')
    tdPrice.textContent = "$" +phone.price
    tr.appendChild(tdPrice)

    const tdAge = document.createElement('td')
    tdAge.textContent =  phone.age
    tr.appendChild(tdAge)

    const tdActions = document.createElement('td')
    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.onclick = () => editPhone(phone.id, phone.model, phone.year, phone.storage, phone.price)
    editBtn.className = 'action-btn'

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.onclick = () => deletePhone(phone.id)
    deleteBtn.className = 'action-btn'

    tdActions.appendChild(editBtn)
    tdActions.appendChild(deleteBtn)
    tr.appendChild(tdActions)

    tbody.appendChild(tr)
  })
}

const loadData = async function() {
  const response = await fetch('/data')
  const data = await response.json()
  updateTable(data)
}

window.onload = function() {
  const form = document.querySelector('#phone-form')
  // @ts-ignore
  form.onsubmit = submit
  // @ts-ignore
  document.querySelector('#clear-btn').onclick = clearForm
  loadData()
}