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
    id:1, 
    company: 'WPI',
    role: 'Researcher',
    dateApplied: '2023-01-01',
    resume: 'resume.pdf',
    status: 'applied'

  }
]

let nextId = 2

const calcApplicationAge = function(dateApplied) {
  //JS stores date as ms interally

  const oneDay = 1000*60*60*24; //ms/day
  const appliedDate = new Date(dateApplied + 'T00:00:00');
  const today = new Date();

  today.setHours(0,0,0,0);

  const diffTime = today - appliedDate;
  const diffDays = Math.floor(diffTime / oneDay);
  
  if (diffTime < 0) {
    return 'Invalid date';
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weekCount = Math.floor(diffDays / 7);

    if (weekCount === 1) {
      return '1 week ago';
    }
    return `${weekCount} weeks ago`;

  } else if (diffDays < 365) {
    const monthCount = Math.floor(diffDays / 30);

    if (monthCount === 1) {
      return '1 month ago';
    }
    return `${monthCount} months ago`;
  } else {
    const yearCount = Math.floor(diffDays / 365);

    if (yearCount === 1) {
      return '1 year ago';
    }
    return `${yearCount} years ago`;
  }
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if(request.method === 'DELETE'){
    handleDelete( request, response )
  } else if (request.method === 'PUT'){
    handlePut( request, response )
  }
})

const handleGet = function( request, response ) {
  appdata.forEach(function(application) {
    application.applicationAge = calcApplicationAge(application.dateApplied);
  })
  const filename = dir + request.url.slice( 1 ) 

  if (request.url === '/api/applications') {
    response.writeHead( 200, "OK", 
      {'Content-Type': 'application/json' })
    response.end(JSON.stringify(appdata))
  } else if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
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
    //console.log( JSON.parse( dataString ) )
    // ... do something with the data here!!!

    const newApplication = JSON.parse(dataString)
    newApplication.id= nextId
    nextId++
    newApplication.applicationAge = calcApplicationAge(newApplication.dateApplied)
    appdata.push(newApplication)

    console.log(newApplication)

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })

    // change this to incorporate data
    response.end(JSON.stringify(appdata))
  })
}



const handleDelete = function( request, response ) {

  let dataString=''
  request.on('data', function(data) {
    dataString += data
  })

  request.on('end', function() {
    const deleteData = JSON.parse(dataString)

    const index = appdata.findIndex(app => app.id === deleteData.id)
    if (index !== -1) {
      appdata.splice(index, 1)
    }

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    response.end(JSON.stringify(appdata))
  })
}

const handlePut = function(request, response) {

  let dataString=''
  request.on('data', function(data) {
    dataString += data
  })

  request.on('end', function() {
    const updateData = JSON.parse(dataString)

    //find -- returns the actual matching object 
    const application = appdata.find(function(app){
      return app.id === updateData.id
    })

    if (application) {
      application.status = updateData.status
    }

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
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
