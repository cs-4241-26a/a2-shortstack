const { send } = require('process')

const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'firstName': 'Raghavan', 'lastName': 'Rajkumar', 'age': 21},
  { 'firstName': 'Andrew', 'lastName': 'Bugbee', 'age': 21 },
  { 'firstName': 'Sarai', 'lastName': 'Vargas', 'age': 20 } 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if( request.method === 'DELETE' ){
    handleDelete( request, response )
  } else if( request.method === 'PUT' ){
    handleUpdate( request, response )
  }
})

const handleGet = function( request, response ) {
  if  ( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else if ( request.url === '/data' ) {
    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(appdata))
  } else {
    const filename = dir + request.url.slice( 1 )
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const data = JSON.parse( dataString )
    console.log( data )

    appdata.push( data )

    response.writeHead( 200, {'Content-Type': 'application/json' })

    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function( request, response ) {
  const index = parseInt( request.url.split('/')[2] )

  if ( !isNaN(index) && index >= 0 && index < appdata.length ) {
    appdata.splice(index, 1)
    response.writeHead( 200, {'Content-Type': 'application/json' })
    response.end(JSON.stringify(appdata))
  } else {
    response.writeHead( 400, {'Content-Type': 'text/plain' })
    response.end('Invalid index for deletion')
  }
}

const handleUpdate = function( request, response ) {
  let dataString = ''

  const index = parseInt( request.url.split('/')[2] )

  if ( !isNaN(index) && index >= 0 && index < appdata.length ) {
    request.on( 'data', function( data ) {
      dataString += data 
    })

    request.on( 'end', function() {
      const updatedData = JSON.parse( dataString )
      appdata[index] = updatedData

      response.writeHead( 200, {'Content-Type': 'application/json' })
      response.end(JSON.stringify(appdata))
    })
  } else {
    response.writeHead( 400, {'Content-Type': 'text/plain' })
    response.end('Invalid index for update')
  }
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
