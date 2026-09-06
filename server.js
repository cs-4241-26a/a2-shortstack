const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'entry': 'shower',            'deadline': Number(new Date("2026-9-5T22:00:00")), 'priority':3 },
  { 'entry': 'meal prep',         'deadline': Number(new Date("2026-9-5T21:30:00")), 'priority':3 },
  { 'entry': 'webware homweork',  'deadline': Number(new Date("2026-9-3T21:30:00")), 'priority':1 },
  { 'entry': 'geology homework',  'deadline': Number(new Date("2026-9-5T21:30:00")), 'priority':2 },
  { 'entry': 'geology exam',      'deadline': Number(new Date("2026-9-3T11:00:00")), 'priority':1 },
  { 'entry': 'physics homework',  'deadline': Number(new Date("2026-9-5T21:30:00")), 'priority':2 },
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    // ... do something with the data here!!!

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })

    // change this to incorporate data
    response.end('test')
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
