const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const calculateVolume = function( sets, reps, weight ) {
  return sets * reps * weight
}

const appdata = []

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
  }else if( request.url === '/data' ){
    response.writeHead( 200, "OK", {'Content-Type': 'application/json'} )
    response.end( JSON.stringify( appdata ) )
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

    if( request.url === '/submit' ) {
      const workout = {
        'id': appdata.length === 0 ? 1 : appdata[ appdata.length - 1 ].id + 1,
        'exercise': incoming.exercise,
        'sets': Number( incoming.sets ),
        'reps': Number( incoming.reps ),
        'weight': Number( incoming.weight )
      }

      workout.volume = calculateVolume( workout.sets, workout.reps, workout.weight )
      appdata.push( workout )

    }else if( request.url === '/delete' ){
      const index = appdata.findIndex( function( workout ) {
        return workout.id === Number( incoming.id )
      })

      if( index !== -1 ) {
        appdata.splice( index, 1 )
      }

    }else if( request.url === '/update' ){
      const workout = appdata.find( function( workout ) {
        return workout.id === Number( incoming.id )
      })

      if( workout !== undefined ) {
        workout.exercise = incoming.exercise
        workout.sets = Number( incoming.sets )
        workout.reps = Number( incoming.reps )
        workout.weight = Number( incoming.weight )
        workout.volume = calculateVolume( workout.sets, workout.reps, workout.weight )
      }
    }

    response.writeHead( 200, "OK", {'Content-Type': 'application/json'} )
    response.end( JSON.stringify( appdata ) )
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