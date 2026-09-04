const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

// our dataset with each todo
let nextId = 4
const appdata = [
  { id: 1, task: 'Finish math homework', priority: 'high',   list: 'open',   created: '2026-09-04', deadline: '2026-09-05' },
  { id: 2, task: 'Do the laundry',       priority: 'low',    list: 'closed', created: '2026-09-04', deadline: '2026-09-11' },
  { id: 3, task: 'Email my professor',   priority: 'medium', list: 'done',   created: '2026-09-04', deadline: '2026-09-07' }
]

// helper to add number of days to date string
const addDays = function( dateString, days ) {
  const date = new Date( dateString )
  date.setDate( date.getDate() + days )
  return date.toISOString().slice( 0, 10 )
}

// Dervied to set deadline based on priority
const makeDeadline = function( created, priority ) {
  let days = 7
  if( priority === 'high' ) {
    days = 1
  } 
  
  else if( priority === 'medium' ) {
    days = 3
  }
  return addDays( created, days )
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }
  
  else if( request.method === 'POST' ){
    handlePost( request, response )
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 )

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }
  
  else if( request.url === '/data' ) {
    // send dataset back as json
    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( appdata ) )
  }
  
  else{
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
    let error = null

    if( request.url === '/add' ) {
      // build new todo
      const created = new Date().toISOString().slice( 0, 10 )
      const todo = {
        id: nextId,
        task: incoming.task,
        priority: incoming.priority,
        list: 'open',
        created: created,
        deadline: makeDeadline( created, incoming.priority )
      }
      nextId += 1
      appdata.push( todo )

    }
    
    else if( request.url === '/delete' ) {
      // find item with same id and remove it
      for( let i = 0; i < appdata.length; i++ ) {
        if( appdata[ i ].id === incoming.id ) {
          appdata.splice( i, 1 )
          break
        }
      }

    }
    
    else if( request.url === '/edit' ) {
      // find item with same id and change task text
      for( let i = 0; i < appdata.length; i++ ) {
        if( appdata[ i ].id === incoming.id ) {
          appdata[ i ].task = incoming.task
          break
        }
      }

    }
    
    else if( request.url === '/move' ) {
      // only allowing 3 items in the closed list
      if( incoming.list === 'closed' ) {
        let count = 0
        for( let i = 0; i < appdata.length; i++ ) {
          if( appdata[ i ].list === 'closed' ) {
            count += 1
          }
        }
        if( count >= 3 ) {
          error = 'The In Progress list can only hold 3 items.'
        }
      }

      if( error === null ) {
        for( let i = 0; i < appdata.length; i++ ) {
          if( appdata[ i ].id === incoming.id ) {
            appdata[ i ].list = incoming.list
            break
          }
        }
      }
    }

    // send updated dataset and error message back to client
    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( { todos: appdata, error: error } ) )
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename )

   fs.readFile( filename, function( err, content ) {

     // if no error load is success
     if( err === null ) {

       // status code from https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }
     
     else{

       // file not found then error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
