// FRONT-END (CLIENT) JAVASCRIPT HERE

const loadExpenses = async function() {
  const response = await fetch( '/expenses' )
  const expenses = await response.json()
  renderTable( expenses )
}

const renderTable = function( expenses ) {
  const tbody = document.querySelector( '#results-body' )
  tbody.innerHTML = ''

  expenses.forEach( function( expense ) {
    const row = document.createElement( 'tr' )
    row.innerHTML = `
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>${expense.spendLevel}</td>
      <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
    `
    tbody.appendChild( row )
  })

  document.querySelectorAll( '.delete-btn' ).forEach( function( btn ) {
    btn.onclick = deleteExpense
  })
}

const addExpense = async function( event ) {
  event.preventDefault()

  const description = document.querySelector( '#description' ).value,
        category = document.querySelector( '#category' ).value,
        amount = document.querySelector( '#amount' ).value,
        json = { description, category, amount },
        body = JSON.stringify( json )

  const response = await fetch( '/add', {
    method: 'POST',
    body
  })

  const expenses = await response.json()
  renderTable( expenses )

  document.querySelector( '#expense-form' ).reset()
}

const deleteExpense = async function( event ) {
  const id = parseInt( event.target.dataset.id ),
        json = { id },
        body = JSON.stringify( json )

  const response = await fetch( '/delete', {
    method: 'POST',
    body
  })

  const expenses = await response.json()
  renderTable( expenses )
}

window.onload = function() {
  document.querySelector( '#expense-form' ).onsubmit = addExpense
  loadExpenses()
}