const form = document.querySelector( '#book-form' )
const list = document.querySelector( '#book-list' )
const message = document.querySelector( '#message' )

const loadBooks = async function() {
  const response = await fetch( '/data' )
  renderBooks( await response.json() )
}

const renderBooks = function( books ) {
  list.innerHTML = books.map( book => `<tr><td>${book.title}</td><td>${book.author}</td><td>${book.pages}</td><td>${book.minutesPerDay}</td><td>${book.readingTime} days</td><td><button class='edit' data-id='${book.id}'>Edit</button> <button class='delete secondary' data-id='${book.id}'>Delete</button></td></tr>` ).join( '' )
  document.querySelector( '#book-count' ).textContent = `${books.length} book${books.length === 1 ? '' : 's'}`
}

const getFormData = function() {
  return { title: document.querySelector( '#title' ).value, author: document.querySelector( '#author' ).value, pages: document.querySelector( '#pages' ).value, minutesPerDay: document.querySelector( '#minutesPerDay' ).value }
}

form.addEventListener( 'submit', async function( event ) {
  event.preventDefault()
  const id = document.querySelector( '#book-id' ).value
  const response = await fetch( id ? `/data?id=${id}` : '/data', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( getFormData() ) } )
  const result = await response.json()
  if( !response.ok ) { message.textContent = result.error; return }
  renderBooks( result ); form.reset(); document.querySelector( '#book-id' ).value = ''
  document.querySelector( '#save-button' ).textContent = 'Add book'; document.querySelector( '#cancel-button' ).hidden = true
  message.textContent = id ? 'Book updated.' : 'Book added.'
})

list.addEventListener( 'click', async function( event ) {
  const id = event.target.dataset.id
  if( !id ) return
  if( event.target.classList.contains( 'delete' ) ) {
    const response = await fetch( `/data?id=${id}`, { method: 'DELETE' } )
    renderBooks( await response.json() ); message.textContent = 'Book deleted.'
    return
  }
  const response = await fetch( '/data' )
  const book = ( await response.json() ).find( item => item.id === Number( id ) )
  document.querySelector( '#book-id' ).value = book.id; document.querySelector( '#title' ).value = book.title; document.querySelector( '#author' ).value = book.author
  document.querySelector( '#pages' ).value = book.pages; document.querySelector( '#minutesPerDay' ).value = book.minutesPerDay
  document.querySelector( '#save-button' ).textContent = 'Update book'; document.querySelector( '#cancel-button' ).hidden = false
})

document.querySelector( '#cancel-button' ).addEventListener( 'click', function() {
  form.reset(); document.querySelector( '#book-id' ).value = ''; document.querySelector( '#save-button' ).textContent = 'Add book'; this.hidden = true
})

loadBooks()
