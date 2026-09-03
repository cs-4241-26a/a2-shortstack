const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { id: 1, title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304, minutesPerDay: 30, readingTime: 6 },
  { id: 2, title: 'Kindred', author: 'Octavia E. Butler', pages: 288, minutesPerDay: 30, readingTime: 5 }
]
let nextId = 3

const sendJson = function( response, status, data ) {
  response.writeHead( status, { 'Content-Type': 'application/json' } )
  response.end( JSON.stringify( data ) )
}

const readBody = function( request, callback ) {
  let dataString = ''
  request.on( 'data', data => dataString += data )
  request.on( 'end', function() {
    try { callback( null, JSON.parse( dataString ) ) } catch( error ) { callback( error ) }
  })
}

const makeBook = function( input, id ) {
  const pages = Number( input.pages )
  const minutesPerDay = Number( input.minutesPerDay )
  return { id, title: String( input.title ).trim(), author: String( input.author ).trim(), pages, minutesPerDay, readingTime: Math.ceil( pages / ( minutesPerDay * 2 ) ) }
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if( request.method === 'PUT' ){
    handlePut( request, response )
  }else if( request.method === 'DELETE' ){
    handleDelete( request, response )
  }else{
    sendJson( response, 405, { error: 'Method not allowed.' } )
  }
})

const handleGet = function( request, response ) {
  if( request.url === '/data' ) return sendJson( response, 200, appdata )
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  readBody( request, function( error, input ) {
    if( error ) return sendJson( response, 400, { error: 'Invalid JSON' } )
    if( !input.title || !input.author || Number( input.pages ) <= 0 || Number( input.minutesPerDay ) <= 0 ) return sendJson( response, 400, { error: 'Please complete every field.' } )
    appdata.push( makeBook( input, nextId++ ) )
    sendJson( response, 201, appdata )
  })
}

const handlePut = function( request, response ) {
  const id = Number( new URL( request.url, 'http://localhost' ).searchParams.get( 'id' ) )
  readBody( request, function( error, input ) {
    const index = appdata.findIndex( book => book.id === id )
    if( error || index === -1 ) return sendJson( response, 400, { error: 'Book not found or invalid JSON.' } )
    appdata[ index ] = makeBook( input, id )
    sendJson( response, 200, appdata )
  })
}

const handleDelete = function( request, response ) {
  const id = Number( new URL( request.url, 'http://localhost' ).searchParams.get( 'id' ) )
  const index = appdata.findIndex( book => book.id === id )
  if( index === -1 ) return sendJson( response, 404, { error: 'Book not found.' } )
  appdata.splice( index, 1 )
  sendJson( response, 200, appdata )
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
