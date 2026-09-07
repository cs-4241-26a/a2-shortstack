const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let appdata = [
  { 'entry': 'shower',            'deadline': Number(new Date("2026-09-05T22:00:00")), 'priority':3 },
  { 'entry': 'meal prep',         'deadline': Number(new Date("2026-09-05T21:30:00")), 'priority':3 },
  { 'entry': 'webware homweork',  'deadline': Number(new Date("2026-09-03T21:30:00")), 'priority':1 },
  { 'entry': 'geology homework',  'deadline': Number(new Date("2026-09-05T21:30:00")), 'priority':2 },
  { 'entry': 'geology exam',      'deadline': Number(new Date("2026-09-03T11:00:00")), 'priority':1 },
  { 'entry': 'physics homework',  'deadline': Number(new Date("2026-09-05T21:30:00")), 'priority':2 },
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
  } else if ( request.url === '/data') {
    sendData( response )
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
    if (request.url === '/submit') {
      appdata.push(JSON.parse(dataString))
    } else if (request.url === '/delete') {
      let index = parseInt(JSON.parse(dataString).index)
      appdata.splice(index, 1) 
    }
    appdata = orderData( appdata )
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
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

const sendData = function( response ) {
  response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
  response.end(JSON.stringify(appdata))
}

// reorders appdata, returns new 
const orderData = function( data_ = appdata) {
  // make copy of appdata 
  let data = JSON.parse(JSON.stringify(data_)) 

  // using bubblesort going by the date, 
  // and then encorporating the priority
  // to schedule an amount of days prior
  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data.length - i - 1; j++) {
      if(
        new Date(data[j].deadline - data[j].priority * 3600000) > 
        new Date(data[j + 1].deadline - data[j+1].priority * 3600000)
      ) {
        let temp = data[j]
        data[j] = data[j+1]
        data[j+1] = temp 
      } 
    }
  } 

  for(let i = 0; i < data.length; i++) {
    data[i].order = i; 
  }

  return data; 
}

appdata = orderData( appdata )
server.listen( process.env.PORT || port )
