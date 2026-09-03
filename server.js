const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

function addToDoItem(dataString) {
  
}

const appdata = [
  { 'model': 'toyota', 'year': 1999, 'mpg': 23 },
  { 'model': 'honda', 'year': 2004, 'mpg': 30 },
  { 'model': 'ford', 'year': 1987, 'mpg': 14} 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  } else if ( request.method === 'POST' ) {
    handlePost( request, response ) 
  } else if ( request.method === 'DELETE' ) {
    handleDelete( request, response )
  }
})

const handleGet = function( request, response ) {
  if (request.url === '/submit') {
    response.writeHead( 200, 'OK', {'Content-Type': 'text/plain'} )
    response.end(JSON.stringify(appdata))
  } else {
    const filename = dir + request.url.slice( 1 ) 

    if( request.url === '/' ) {
      sendFile( response, 'public/index.html' )
    }else{
      sendFile( response, filename )
    }
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data 
  })

  request.on( 'end', function() {
    const item = JSON.parse( dataString )
    console.log( item )
    if (item.year && item.model && item.mpg) {
      appdata.push(item)
    }

    response.writeHead( 200, 'OK', {'Content-Type': 'text/plain'} )

    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    const item = JSON.parse( dataString )
    console.log( item )
    const deletionIndex = appdata.findIndex(x => x.model == item.model && x.year == item.year && x.mpg == item.mpg)
    if (deletionIndex >= 0) appdata.splice(deletionIndex, 1)

    response.writeHead( 200, 'OK', {'Content-Type': 'text/plain' } )

    response.end(JSON.stringify(appdata))
  })
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
