const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [{
  name: 'Mac n Cheese',
  preptime: 5,
  cooktime: 10,
  totaltime: 15,
  ingredients: '- Macaroni\n- Cheese\n- Milk\n- Other stuff',
  steps: '1. Cook the pasta\n2. Add the cheese and milk and other stuff\n3. Eat :)',
  index:0
  }]

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
  }
  else if( request.url === '/data' ) {
      textresponse = JSON.stringify(appdata)
      // change this to incorporate data
      response.end(textresponse)
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  if( request.url === '/submit' ){
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })

    request.on( 'end', function() {
      newdata = JSON.parse( dataString )
      newdata.totaltime = newdata.preptime + newdata.cooktime
      newdata.index = appdata.length
      // console.log( data )
      appdata.push(newdata)
      // console.log(appdata)

      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })

      textresponse = JSON.stringify(newdata)
      // change this to incorporate data
      response.end(textresponse)
    })
  }
  else if(request.url === '/delete'){
    console.log('Deletion request recieved')

    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })

    request.on( 'end', function() {
      index = parseInt( dataString )
      appdata.splice(index, 1)
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })

      textresponse = 'ok'
      response.end(textresponse)
    })
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
