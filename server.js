const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  {title: 'Dune', type: 'Film', platform: 'HBOMax', dateAdded: '4/20/2024'},
  {title: 'Better Call Saul', type: 'Show', platform: 'Netflix', dateAdded: '6/7/2026'}
]

const addDerivedField = function(item) {
  item.dateAdded = new Date().toLocaleDateString()
  return item
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    if(request.url === '/submit') {
    handlePost( request, response ) 
    }else if(request.url === '/edit') {
      handleEdit(request, response)
    }else if(request.url === '/delete') {
      handleDelete(request, response)
    }
  }
})

const handleGet = function( request, response ) {
   
  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if(request.url === '/data'){
    response.writeHead(200, {
      'Content-Type': 'application/json'
    })
    response.end(JSON.stringify(appdata))
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
    const item = JSON.parse(dataString)
    addDerivedField(item)
    appdata.push(item)
    response.writeHead( 200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(appdata))
  })
}

const handleEdit = function(request, response) {
  let dataString = ''

  request.on('data', function(data) {
    dataString += data
  })

  request.on('end', function() {
    const data = JSON.parse(dataString)

    appdata[data.index].title = data.item.title
    appdata[data.index].type = data.item.type
    appdata[data.index].platform = data.item.platform

    response.writeHead(200, {'Content-Type': 'application/json'})

    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function(request, response) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on('end', function() {
    const data = JSON.parse(dataString)

    appdata.splice(data.index, 1)

    response.writeHead(200, {'Content-Type': 'application/json'})

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

server.listen( process.env.PORT || port )
