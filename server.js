const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let appdata = [
  { id: 1, model: 'Pixel 8a', year: 2024, storage: "256GB", age: 2, price: 349.99 },
  { id: 2, model: 'Pixel 8 XL', year: 2024, storage: "512GB", age: 2, price: 549.99 },
  { id: 3, model: 'Pixel 4', year: 2019, storage: "256GB", age: 7, price: 120.00 } 
]
let nextId = 4

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
  } else if ( request.url === '/data' ) {
    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( appdata ) )
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
    const reqData = JSON.parse( dataString )

    if (reqData.action === 'add') {
      reqData.data.id = nextId++
      reqData.data.age = 2026 - parseInt(reqData.data.year)
      appdata.push(reqData.data)
    } else if (reqData.action === 'delete') {
      appdata = appdata.filter(item => item.id !== parseInt(reqData.id))
    } else if (reqData.action === 'modify') {
      const index = appdata.findIndex(item => item.id === parseInt(reqData.data.id))
      if (index !== -1) {
        reqData.data.age = 2026 - parseInt(reqData.data.year)
        appdata[index] = reqData.data
      }
    }

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })

    // change this to incorporate data
    response.end( JSON.stringify( appdata ) )
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHead( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHead( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

// eslint-disable-next-line no-undef
server.listen( process.env.PORT || port )