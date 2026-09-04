// FRONT-END (CLIENT) JAVASCRIPT HERE

let editingIndex = null

const loadGames = async function() {

  const response = await fetch( '/data' )
  const games = await response.json()
  
  const table = document.querySelector('#game-table')

  table.innerHTML = ''

  games.forEach(function(game,index) {
    const row = document.createElement('tr')

    row.classList.add('game-row')

    row.innerHTML = `
      <td>${game.name}</td>
      <td>${game.genre}</td>
      <td>${game.hours}</td>
      <td>${game.rating}</td>
      <td>${game.recommendation}</td>
      <td>
        <button class="edit-button" data-index="${index}">&#128393</button>
        <button class="delete-button" data-index="${index}">&#128465</button>
      </td>
    `

    table.appendChild(row)
  })

  const buttons = document.querySelectorAll('.delete-button')
  const editbuttons = document.querySelectorAll('.edit-button')


  buttons.forEach(function(button) {
    button.onclick = deleteGame
  })

  editbuttons.forEach(function(button) {
    button.onclick = editGame
  })
  
}

const deleteGame = async function (event){
  const index = event.target.dataset.index

  await fetch('/delete/' + index, {
    method: 'DELETE'
  })

  loadGames()
}

const editGame = async function ( event ) {

  const index = event.target.dataset.index

  editingIndex = index

  const name = document.querySelector('#gamename').value
  const genre = document.querySelector('#genre').value
  const hours = document.querySelector('#hoursplayed').value
  const rating = document.querySelector('#rating').value

  document.querySelector('form button').textContent = 'Save Changes'


  const game = {
    name: name,
    genre: genre,
    hours: Number(hours),
    rating: Number(rating)
  }

  await fetch('/edit/' + index, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(game)
  })

  document.querySelector('form').reset()

  loadGames()

}

const submitGame = async function( event ) {

  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const name = document.querySelector('#gamename').value
  const genre = document.querySelector('#genre').value
  const hours = document.querySelector('#hoursplayed').value
  const rating = document.querySelector('#rating').value

  const game = {
    name: name,
    genre: genre,
    hours: Number(hours),
    rating: Number(rating)
  }

  let response

  if(editingIndex === null){

    response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(game)
    })

  } else {
      response = await fetch('/edit/' + editingIndex, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(game)
      })
  }

  console.log(await response.text())
  
  document.querySelector('form').reset()

  editingIndex = null

  document.querySelector('form button').textContent = 'Add Game'

  loadGames()

}

window.onload = function() {
  loadGames();

const form = document.querySelector('form')
form.onsubmit = submitGame
}
