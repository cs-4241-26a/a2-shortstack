const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'user': 'Noah', 'clockIn': true, 'date': '9/1/2026', 'time': '8:08 AM' },
  { 'user': 'Noah', 'clockIn': false, 'date': '9/1/2026', 'time': '4:02 PM' },
  { 'user': 'Noah', 'clockIn': true, 'date': '9/2/2026', 'time': '8:01 AM' },
  { 'user': 'Jackson', 'clockIn': true, 'date': '9/2/2026', 'time': '10:14 AM' },
  { 'user': 'Noah', 'clockIn': false, 'date': '9/2/2026', 'time': '4:07 PM' },
  { 'user': 'Jackson', 'clockIn': false, 'date': '9/2/2026', 'time': '6:24 PM' }
]

// No user is logged in when the server starts.
let currentUser = null

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response )
  }else {
    response.writeHead(405, { 'Content-Type': 'text/plain' })
    response.end('405 Method Not Allowed')
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if (request.url === '/data') {
    sendJSON(response, appdata)
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
    let data 

    // Convert the incoming JSON string into an object.
    try { 
      data = JSON.parse(dataString) 
    } catch (error) { 
      sendJSON(response, { success: false, error: 'Invalid JSON' }, 400) 
      return 
    }
    
    console.log('POST', request.url, data) 
    
    if (request.url === '/submit') { 
      handleTimeSubmit(data, response) 

    } else if (request.url === '/login') { 
      handleUserLogin(data, response) 

    } else if (request.url === '/logout') { 
      handleUserLogout(data, response) 

    } else { 
      response.writeHead(404, { 'Content-Type': 'text/plain' }) 
      response.end('404 Error: File Not Found') 
    }
  })
}

//Sets the current user. Returns only entries belonging to that user
const handleUserLogin = function( data, response ) {
  if (!data.user || data.user.trim() === '') { 
    sendJSON(response, { success: false, error: 'Username is required' }, 400) 
    return 
  } 
  
  currentUser = data.user.trim() 
  const userEntries = appdata.filter(function(entry) { 
    return entry.user === currentUser 
  }) 
  
  console.log('User logged in:', currentUser) 
  
  sendJSON(response, { success: true, user: currentUser, entries: userEntries })
}

//Removes the currently logged in user. Returns all entries
const handleUserLogout = function( data, response ) {
  console.log('User logged out:', currentUser) 

  currentUser = null 

  sendJSON(response, { success: true, user: null, entries: appdata })
}

//Adds a clock in or clock out entry. A user must be logged in.
// {
//   "date": "9/4/2026",
//   "time": "8:00 AM", 
//   "clockIn": true
// }
//the server adds the currentUser to the entry
const handleTimeSubmit = function( data, response ) {
  if (currentUser === null) { 
    sendJSON(response, { success: false, error: 'No user is logged in' }, 401) 
    return 
  }

  // Validation 
  if (!data.date || !data.time || data.clockIn === undefined) { 
    sendJSON(response, { success: false, error: 'Date, time, and clock-in status are required' }, 400) 
    return 
  }

  const newEntry = { 
    user: currentUser, 
    clockIn: Boolean(data.clockIn), 
    date: data.date, 
    time: data.time 
  } 
  
  // Save the entry. 
  appdata.push(newEntry) 
  
  console.log('New entry:', newEntry)

  const userEntries = appdata.filter(function(entry) { 
    return entry.user === currentUser 
  }) 
  
  sendJSON(response, { success: true, user: currentUser, entries: userEntries })
}


const sendJSON = function(response, data, statusCode = 200) { 
  response.writeHead(statusCode, { 'Content-Type': 'application/json' }) 
  response.end(JSON.stringify(data)) 
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
