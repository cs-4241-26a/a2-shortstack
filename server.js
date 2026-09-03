const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const isVehicle = function(item) {
  const year = item.year,
        model = item.model,
        mpg = item.mpg
  const isNumeric = function(val) {
    if (typeof val === 'string' && val.trim() === '') return false;
    return Number.isFinite(Number(val))
  }

  return year !== null && year !== undefined && isNumeric(year)
    && model !== null && model !== undefined
    && mpg !== null && mpg !== undefined && isNumeric(mpg)
}

const estimateValue = function(item) {
  const basePrice = 27500
  const depreciationRate = 0.075
  const avgMpg = 25

  const age = new Date().getFullYear() - item.year
  const mpg = item.mpg
  
  const ageFactor = (1 - depreciationRate) ** age
  const mpgFactor = Math.sqrt(mpg / avgMpg)

  return Math.round(basePrice * ageFactor * mpgFactor)
}

const appdata = [
  { id: 0, 'model': 'Toyota', 'year': 1999, 'mpg': 23 },
  { id: 1, 'model': 'Honda', 'year': 2004, 'mpg': 30 },
  { id: 2, 'model': 'Ford', 'year': 1987, 'mpg': 14 }
]
for (const item of appdata) {
  item.estVal = estimateValue(item)
}
let appdataNextId = appdata.length

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  } else if ( request.method === 'POST' ) {
    handlePost( request, response ) 
  } else if ( request.method === 'PUT' ) {
    handlePut( request, response )
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
    if (isVehicle(item)) {
      item.id = appdataNextId++
      item.estVal = estimateValue(item)
      console.log( item )
      if (item.year && item.model && item.mpg) {
        appdata.push(item)
      }

      response.writeHead( 200, 'OK', {'Content-Type': 'text/plain'} )

      response.end(JSON.stringify(appdata))
    } else {
      response.writeHead(400)
      response.end('Bad Request')
    }
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
    if (item.id !== null && item.id !== undefined) {
      const deletionIndex = appdata.findIndex(x => x.id === item.id)
      if (deletionIndex >= 0) appdata.splice(deletionIndex, 1)

      response.writeHead( 200, 'OK', {'Content-Type': 'text/plain' } )

      response.end(JSON.stringify(appdata))
    } else {
      response.writeHead(400)
      response.end('Bad Request')
    }
  })
}

const handlePut = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    const item = JSON.parse( dataString )
    console.log( item )
    if (isVehicle(item)) {
      const oldItem = appdata.find(x => x.id === item.id)
      oldItem.model = item.model
      oldItem.year = item.year
      oldItem.mpg = item.mpg
      oldItem.estVal = estimateValue(item)

      response.writeHead( 200, 'OK', {'Content-Type': 'text/plain' } )

      response.end(JSON.stringify(appdata))
    } else {
      response.writeHead(400)
      response.end('Bad Request')
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
