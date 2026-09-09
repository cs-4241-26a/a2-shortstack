const http = require('http')
const fs = require('fs')
const path = require('path')

const dir = 'public/'
const port = 3000


let appdata = [
  {
    id: 1,
    movie: 'Spider-Man: Brand New Day',
    genre: 'Adventure',
    rating: 10,
    recommendation: 'Must Watch'
  },
  {
    id: 2,
    movie: 'The Odyssey',
    genre: 'Action',
    rating: 8,
    recommendation: 'Must Watch'
  },
  {
    id: 3,
    movie: 'Toy Story 5',
    genre: 'Animation',
    rating: 6,
    recommendation: 'Worth Watching'
  }
]

let nextId = 4

function getRecommendation(rating) {

  const numberRating = Number(rating)

  if (numberRating >= 8) {
    return 'Must Watch'
  }

  if (numberRating >= 6) {
    return 'Worth Watching'
  }

  return 'Skip'
}

const server = http.createServer(function(request, response) {

  if (request.method === 'GET') {

    handleGet(request, response)

  } else if (request.method === 'POST') {

    handlePost(request, response)

  } else {

    sendJSON(response, 405, {
      error: 'Method not allowed'
    })

  }

})

function handleGet(request, response) {

  // Send entire dataset to browser.
  if (request.url === '/api/movies') {

    sendJSON(response, 200, appdata)
    return

  }

  // Homepage.
  if (request.url === '/') {

    sendFile(response, 'public/index.html')
    return

  }

  const safePath =
    path.normalize(request.url).replace(/^(\.\.[/\\])+/, '')

  const filename =
    path.join(dir, safePath)

  sendFile(response, filename)
}

function handlePost(request, response) {

  let dataString = ''

  request.on('data', function(data) {

    dataString += data

  })

  request.on('end', function() {

    let incoming

    try {

      incoming = JSON.parse(dataString || '{}')

    } catch (error) {

      sendJSON(response, 400, {
        error: 'Invalid JSON'
      })

      return
    }

    if (request.url === '/api/add') {

      addMovie(incoming, response)
      return

    }

    if (request.url === '/api/delete') {

      deleteMovie(incoming, response)
      return

    }

    if (request.url === '/api/edit') {

      editMovie(incoming, response)
      return

    }

    sendJSON(response, 404, {
      error: 'Route not found'
    })

  })
}

function addMovie(incoming, response) {

  const movie =
    String(incoming.movie || '').trim()

  const genre =
    String(incoming.genre || '').trim()

  const rating =
    Number(incoming.rating)

  if (
    !movie ||
    !genre ||
    Number.isNaN(rating) ||
    rating < 1 ||
    rating > 10
  ) {

    sendJSON(response, 400, {
      error: 'Please enter a movie, genre, and rating from 1 to 10.'
    })

    return
  }

  const newMovie = {

    id: nextId++,

    movie: movie,

    genre: genre,

    rating: rating,

    recommendation:
      getRecommendation(rating)

  }

  appdata.push(newMovie)

  sendJSON(response, 200, appdata)
}

function deleteMovie(incoming, response) {

  const id =
    Number(incoming.id)

  appdata =
    appdata.filter(function(item) {

      return item.id !== id

    })

  sendJSON(response, 200, appdata)
}

function editMovie(incoming, response) {

  const id =
    Number(incoming.id)

  const movie =
    String(incoming.movie || '').trim()

  const genre =
    String(incoming.genre || '').trim()

  const rating =
    Number(incoming.rating)

  if (
    !movie ||
    !genre ||
    Number.isNaN(rating) ||
    rating < 1 ||
    rating > 10
  ) {

    sendJSON(response, 400, {
      error: 'Please enter a movie, genre, and rating from 1 to 10.'
    })

    return
  }

  const index =
    appdata.findIndex(function(item) {

      return item.id === id

    })

  if (index === -1) {

    sendJSON(response, 404, {
      error: 'Movie not found.'
    })

    return
  }

  appdata[index] = {

    id: id,

    movie: movie,

    genre: genre,

    rating: rating,

   
    recommendation:
      getRecommendation(rating)

  }

  sendJSON(response, 200, appdata)
}

function sendJSON(response, statusCode, data) {

  response.writeHead(
    statusCode,
    {
      'Content-Type': 'application/json'
    }
  )

  response.end(
    JSON.stringify(data)
  )
}

function sendFile(response, filename) {

  const extension =
    path.extname(filename).toLowerCase()

  const contentTypes = {

    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'

  }

  const type =
    contentTypes[extension] ||
    'text/plain'

  fs.readFile(
    filename,
    function(err, content) {

      if (err === null) {

        response.writeHead(
          200,
          {
            'Content-Type': type
          }
        )

        response.end(content)

      } else {

        response.writeHead(
          404,
          {
            'Content-Type':
              'text/plain'
          }
        )

        response.end(
          '404 Error: File Not Found'
        )

      }

    }
  )
}

server.listen(
  process.env.PORT || port,
  function() {

    console.log(
      'Movie Watchlist running on port ' +
      (process.env.PORT || port)
    )

  }
)