const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let appdata = [
  { id: 1, task: 'Prepare for MQP meeting', priority: 'high', created: '2026-09-01', deadline: '2026-09-08' },
  { id: 2, task: 'WPI Esports tryouts', priority: 'medium', created: '2026-09-01', deadline: '2026-09-07' },
  { id: 3, task: 'Take out trash', priority: 'low', created: '2026-09-01', deadline: '2026-09-04' }
]

// keeps track of the next id to hand out to a new task
let nextId = 4

const calculateDeadline = function( priority, createdDateString ) {
  let daysToAdd

  if( priority === 'high' ) {
    daysToAdd = 1
  }else if( priority === 'medium' ) {
    daysToAdd = 3
  }else{
    daysToAdd = 7 // low priority 
  }

  const created = new Date( createdDateString )
  created.setDate( created.getDate() + daysToAdd )

  // format back to YYYY-MM-DD string
  return created.toISOString().split( 'T' )[ 0 ]
}


const server = http.createServer( function( request, response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }else if( request.method === 'POST' ) {
    handlePost( request, response )
  }
})

const handleGet = function( request, response ) {
  if( request.url === '/data' ) {
    sendJSON( response, appdata )
    return
  }

  const filename = dir + request.url.slice( 1 )

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    const incoming = JSON.parse( dataString )

    if( request.url === '/add' ) {
      addTask( incoming )
    }else if( request.url === '/delete' ) {
      deleteTask( incoming )
    }

    // Whatever action happened, send back task list so the page can refresh what it shows
    sendJSON( response, appdata )
  })
}

// Adds a new task to appdata, computing the derived "deadline" field first
const addTask = function( incoming ) {
  const newTask = {
    id: nextId,
    task: incoming.task,
    priority: incoming.priority,
    created: incoming.created,
    deadline: calculateDeadline( incoming.priority, incoming.created )
  }

  nextId = nextId + 1
  appdata.push( newTask )
}

// Removes a task from appdata by id
const deleteTask = function( incoming ) {
  appdata = appdata.filter( function( item ) {
    return item.id !== incoming.id
  })
}

const sendJSON = function( response, data ) {
  response.writeHead( 200, { 'Content-Type': 'application/json' })
  response.end( JSON.stringify( data ) )
}

const sendFile = function( response, filename ) {
  const type = mime.getType( filename )

  fs.readFile( filename, function( err, content ) {

    // if the error = null, then we've loaded the file successfully
    if( err === null ) {

      // status code: https://httpstatuses.com
      response.writeHeader( 200, { 'Content-Type': type })
      response.end( content )

    }else{

      // file not found, error code 404
      response.writeHeader( 404 )
      response.end( '404 Error: File Not Found' )

    }
  })
}

server.listen( process.env.PORT || port )
