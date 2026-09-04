const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'show': 'Silo', 'watched': 20, 'total': 25 },
  { 'show': 'Slow Horses', 'watched': 30, 'total': 30 },
  { 'show': 'Severance', 'watched': 19, 'total': 20 },
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
    //send data to client
  }else if(request.url === '/results') {
    response.writeHead(200, {
      'Content-Type': 'application/json' })
    response.end (JSON.stringify(appdata))
  } else {
    sendFile( response, filename )
  }
}
//adding and deleting data
const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data
  })

  request.on( 'end', function() {
    // ... do something with the data here!!!
    //for adding a new show
    if (request.url === '/submit'){
      const newItem = JSON.parse (dataString)
      //calculate the percent watched of the show
      calculatePercent (newItem)
      appdata.push (newItem)
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(JSON.stringify(appdata))
      //delete a specific show
    } else if (request.url === '/delete'){
      const item = JSON.parse (dataString)
      appdata.splice(item.index, 1)
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(JSON.stringify(appdata))
      //edit show
    } else if (request.url === '/modify'){
      const item = JSON.parse (dataString)
      const modified = {
        show: item.show,
        watched: item.watched,
        total: item.total
      }
      calculatePercent (modified )
      appdata[item.index] = modified
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(JSON.stringify(appdata))

    }
    // change this to incorporate data
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
//calculates the percent complete thru a show the user is
const calculatePercent = function (item) {
    //from total episodes and watched so far
  if (item.total === 0) {
    item.percent = 0
  } else {
    item.percent = Math.round ((item.watched / item.total) * 100)
  }
  return item
}
appdata.forEach( calculatePercent )

server.listen( process.env.PORT || port )
