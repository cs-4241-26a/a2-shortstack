const form =
  document.querySelector('#movie-form')

const movieInput =
  document.querySelector('#movie')

const genreInput =
  document.querySelector('#genre')

const ratingInput =
  document.querySelector('#rating')

const movieIdInput =
  document.querySelector('#movie-id')

const results =
  document.querySelector('#movie-results')

const submitButton =
  document.querySelector('#submit-button')

const cancelButton =
  document.querySelector('#cancel-button')

const message =
  document.querySelector('#message')

const movieCount =
  document.querySelector('#movie-count')


async function loadMovies() {

  const response =
    await fetch('/api/movies')

  const data =
    await response.json()

  renderMovies(data)

}


async function submitMovie(event) {

  event.preventDefault()

  const movie =
    movieInput.value.trim()

  const genre =
    genreInput.value

  const rating =
    Number(ratingInput.value)

  const id =
    movieIdInput.value


  const body =
    JSON.stringify({
      movie: movie,
      genre: genre,
      rating: rating,
      id: id
    })


  let url = '/api/add'

  if (id) {

    url = '/api/edit'

  }


  const response =
    await fetch(
      url,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: body
      }
    )


  const data =
    await response.json()


  if (!response.ok) {

    message.textContent =
      data.error

    return
  }


  renderMovies(data)

  resetForm()

  if (id) {

    message.textContent =
      'Movie updated!'

  } else {

    message.textContent =
      'Movie added!'

  }

}


async function deleteMovie(id) {

  const response =
    await fetch(
      '/api/delete',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify({
            id: id
          })
      }
    )


  const data =
    await response.json()


  renderMovies(data)

  message.textContent =
    'Movie deleted.'

}


function startEdit(movie) {

  movieIdInput.value =
    movie.id

  movieInput.value =
    movie.movie

  genreInput.value =
    movie.genre

  ratingInput.value =
    movie.rating


  submitButton.textContent =
    'Save Changes'

  cancelButton.classList.remove(
    'hidden'
  )

  message.textContent =
    'Editing ' + movie.movie

}


function resetForm() {

  form.reset()

  movieIdInput.value = ''

  submitButton.textContent =
    'Add Movie'

  cancelButton.classList.add(
    'hidden'
  )

}


function renderMovies(movies) {

  results.innerHTML = ''


  movieCount.textContent =
    movies.length +
    (movies.length === 1
      ? ' movie'
      : ' movies')


  if (movies.length === 0) {

    const row =
      document.createElement('tr')

    const cell =
      document.createElement('td')

    cell.colSpan = 5

    cell.className =
      'empty-state'

    cell.textContent =
      'No movies yet. Add one above!'

    row.appendChild(cell)

    results.appendChild(row)

    return
  }


  movies.forEach(function(movie) {

    const row =
      document.createElement('tr')


    const movieCell =
      document.createElement('td')

    movieCell.textContent =
      movie.movie


    const genreCell =
      document.createElement('td')

    genreCell.textContent =
      movie.genre


    const ratingCell =
      document.createElement('td')

    ratingCell.textContent =
      movie.rating + '/10'


    const recommendationCell =
      document.createElement('td')


    const badge =
      document.createElement('span')

    badge.className =
      'recommendation ' +
      recommendationClass(
        movie.recommendation
      )

    badge.textContent =
      movie.recommendation


    recommendationCell.appendChild(
      badge
    )


    const actionsCell =
      document.createElement('td')

    actionsCell.className =
      'actions'


    const editButton =
      document.createElement('button')

    editButton.type =
      'button'

    editButton.className =
      'small-button edit-button'

    editButton.textContent =
      'Edit'

    editButton.addEventListener(
      'click',
      function() {

        startEdit(movie)

      }
    )


    const deleteButton =
      document.createElement('button')

    deleteButton.type =
      'button'

    deleteButton.className =
      'small-button delete-button'

    deleteButton.textContent =
      'Delete'

    deleteButton.addEventListener(
      'click',
      function() {

        deleteMovie(movie.id)

      }
    )


    actionsCell.append(
      editButton,
      deleteButton
    )


    row.append(
      movieCell,
      genreCell,
      ratingCell,
      recommendationCell,
      actionsCell
    )


    results.appendChild(row)

  })

}


function recommendationClass(
  recommendation
) {

  if (
    recommendation ===
    'Must Watch'
  ) {

    return 'must-watch'

  }


  if (
    recommendation ===
    'Worth Watching'
  ) {

    return 'worth-watching'

  }


  return 'skip'

}


form.addEventListener(
  'submit',
  submitMovie
)


cancelButton.addEventListener(
  'click',
  function() {

    resetForm()

    message.textContent =
      'Edit cancelled.'

  }
)


loadMovies()