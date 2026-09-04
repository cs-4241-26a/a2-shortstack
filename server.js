const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = process.env.PORT || 3000

let nextId = 4
const appdata = [
  { id: 1, task: 'Finish CS4241 assignment 2', priority: 'high',   created: new Date().toISOString() },
  { id: 2, task: 'Read chapter 5',              priority: 'medium', created: new Date().toISOString() },
  { id: 3, task: 'Water the plants',            priority: 'low',    created: new Date().toISOString() }
].map( addDerivedFields )

function addDerivedFields( row ) {
  const daysByPriority = { high: 1, medium: 3, low: 7 }
  const offsetDays = daysByPriority[ row.priority ] ?? 5

  const created = new Date( row.created )
  const deadline = new Date( created.getTime() + offsetDays * 24 * 60 * 60 * 1000 )

  return Object.assign( {}, row, { deadline: deadline.toISOString() } )
}

const server = http.createServer( function( request, response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  } else if( request.method === 'POST' ) {
    handlePost( request, response )
  } else if( request.method === 'PUT' ) {
    handlePut( request, response )
  } else if( request.method === 'DELETE' ) {
    handleDelete( request, response )
  } else {
    response.writeHead( 405 )
    response.end( 'Method Not Allowed' )
  }
})

const handleGet = function( request, response ) {
  if( request.url === '/tasks' ) {
    sendJSON( response, appdata )
    return
  }

  const filename = request.url === '/' ? 'public/index.html' : dir + request.url.slice( 1 )
  sendFile( response, filename )
}

const handlePost = function( request, response ) {
  if( request.url !== '/tasks' ) {
    response.writeHead( 404 )
    response.end( 'Not Found' )
    return
  }

  readBody( request, function( body ) {
    const task = ( body.task || '' ).trim()
    const priority = [ 'low', 'medium', 'high' ].includes( body.priority ) ? body.priority : 'medium'

    if( task.length === 0 ) {
      response.writeHead( 400, { 'Content-Type': 'text/plain' } )
      response.end( 'task is required' )
      return
    }

    const row = addDerivedFields({
      id: nextId++,
      task,
      priority,
      created: new Date().toISOString()
    })

    appdata.push( row )
    sendJSON( response, appdata )
  })
}

const handlePut = function( request, response ) {
  // expects URL like /tasks/3
  const match = request.url.match( /^\/tasks\/(\d+)$/ )
  if( !match ) {
    response.writeHead( 404 )
    response.end( 'Not Found' )
    return
  }
  const id = parseInt( match[ 1 ], 10 )

  readBody( request, function( body ) {
    const index = appdata.findIndex( row => row.id === id )
    if( index === -1 ) {
      response.writeHead( 404, { 'Content-Type': 'text/plain' } )
      response.end( 'task not found' )
      return
    }

    const existing = appdata[ index ]
    const task = ( body.task ?? existing.task ).trim()
    const priority = [ 'low', 'medium', 'high' ].includes( body.priority ) ? body.priority : existing.priority

    if( task.length === 0 ) {
      response.writeHead( 400, { 'Content-Type': 'text/plain' } )
      response.end( 'task is required' )
      return
    }

    appdata[ index ] = addDerivedFields({
      id: existing.id,
      task,
      priority,
      created: existing.created
    })

    sendJSON( response, appdata )
  })
}

const handleDelete = function( request, response ) {
  const match = request.url.match( /^\/tasks\/(\d+)$/ )
  if( !match ) {
    response.writeHead( 404 )
    response.end( 'Not Found' )
    return
  }
  const id = parseInt( match[ 1 ], 10 )

  const index = appdata.findIndex( row => row.id === id )
  if( index === -1 ) {
    response.writeHead( 404, { 'Content-Type': 'text/plain' } )
    response.end( 'task not found' )
    return
  }

  appdata.splice( index, 1 )
  sendJSON( response, appdata )
}

const readBody = function( request, callback ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    let body = {}
    try {
      body = dataString.length ? JSON.parse( dataString ) : {}
    } catch( e ) {
      body = {}
    }
    callback( body )
  })
}

const sendJSON = function( response, data ) {
  response.writeHead( 200, { 'Content-Type': 'application/json' } )
  response.end( JSON.stringify( data ) )
}

const sendFile = function( response, filename ) {
  const type = mime.getType( filename )

  fs.readFile( filename, function( err, content ) {

    if( err === null ) {

      response.writeHeader( 200, { 'Content-Type': type } )
      response.end( content )

    } else {

      response.writeHeader( 404 )
      response.end( '404 Error: File Not Found' )

    }
  })
}

server.listen( port )
console.log( 'Server listening on port', port )