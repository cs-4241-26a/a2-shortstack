const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  {
    name: 'Terraria',
    genre: 'Sandbox',
    hours: 933,
    rating: 10,
    recommendation: 'Highly recommended'
  },
  {
    name: 'Nova Drift',
    genre: 'Twin-Stick Arcade Shooter',
    hours: 52,
    rating: 9,
    recommendation: 'Highly recommended'
  },
  {
    name: 'Total War: Warhammer III',
    genre: 'RTS Grand Strategy',
    hours: 440,
    rating: 8,
    recommendation: 'Recommended'
  }
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if( request.method === 'DELETE'){
    handleDelete( request, response)
  }else if( request.method === 'PUT'){
    handlePut( request, response)
  }
})

const handleGet = function( request, response ) {

  if( request.url === '/data' ) {
    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( appdata ) )

  } else if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
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
    console.log(data)
    // ... do something with the data here!!!

    if ( request.url === '/submit' ){

      let recommendation

      if( data.rating === 11){
        recommendation = 'Phenomenal, buy now'
      }else if( data.rating >= 9 ) {
        recommendation = 'Highly Recommended'
      }else if( data.rating >= 7 ) {
        recommendation = 'Recommended'
      }else if( data.rating >= 5 ) {
        recommendation = 'Mixed'
      }else {
        recommendation = 'IGN Approved (Not Recommended)'
      }

      const newGame = {
        name: data.name,
        genre: data.genre,
        hours: data.hours,
        rating: data.rating,
        recommendation: recommendation
      }

      appdata.push(newGame);

      response.writeHead( 200, { 'Content-Type': 'text/plain' })
      response.end('New game added')

    } else {
      response.writeHead( 404, { 'Content-Type': 'text/plain' })
      response.end('404 Error: POST route not found')
    }
  })
}

const handleDelete = function( request, response){
  const index = Number(request.url.split('/')[2])

  if( request.url.startsWith('/delete/') ) {

    if( index >= 0 && index < appdata.length ) {
      appdata.splice(index, 1)

      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('Game deleted')

    }else {
      response.writeHead(404, { 'Content-Type': 'text/plain' })
      response.end('Game not found')
    }

  }else {
    response.writeHead(404, { 'Content-Type': 'text/plain' })
    response.end('404 Error: DELETE route not found')
  }

}

const handlePut = function( request, response ){

  const index = Number(request.url.split('/')[2])

  let dataString = ''

  request.on('data', function(data) {
    dataString += data
  })

  request.on('end', function() {

    const data = JSON.parse(dataString)

    //have to re-do the recommendation code so it updates if the rating changes
    if(index >= 0 && index < appdata.length) {

      let recommendation

      if(data.rating === 11) {
        recommendation = 'Phenomenal, buy now'
      }else if(data.rating >= 9) {
        recommendation = 'Highly Recommended'
      }else if(data.rating >= 7) {
        recommendation = 'Recommended'
      }else if(data.rating >= 5) {
        recommendation = 'Mixed'
      }else {
        recommendation = 'IGN Approved (Not Recommended)'
      }

      appdata[index] = {
        name: data.name,
        genre: data.genre,
        hours: data.hours,
        rating: data.rating,
        recommendation: recommendation
      }

      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('Game updated')

    }else {
      response.writeHead(404, { 'Content-Type': 'text/plain' })
      response.end('Game not found')
    }
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
