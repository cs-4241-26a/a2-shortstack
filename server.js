const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // On Render, make sure `npm install` is your build command.
  mime = require('mime'),
  dir = 'public/',
  port = 3000

const appdata = [
  { 'uid': 1, 'user': 'Noah', 'clockIn': true, 'date': '8/28/2026', 'day': 'Friday', 'time': '8:16 AM' },
  { 'uid': 2, 'user': 'Noah', 'clockIn': false, 'date': '8/28/2026', 'day': 'Friday', 'time': '4:13 PM' },
  { 'uid': 3, 'user': 'Noah', 'clockIn': true, 'date': '8/31/2026', 'day': 'Monday', 'time': '8:01 AM' },
  { 'uid': 4, 'user': 'Noah', 'clockIn': false, 'date': '8/31/2026', 'day': 'Monday', 'time': '3:58 PM' },
  { 'uid': 5, 'user': 'Noah', 'clockIn': true, 'date': '9/1/2026', 'day': 'Tuesday', 'time': '8:04 AM' },
  { 'uid': 6, 'user': 'Frank', 'clockIn': true, 'date': '9/1/2026', 'day': 'Tuesday', 'time': '11:08 AM' },
  { 'uid': 7, 'user': 'Noah', 'clockIn': false, 'date': '9/1/2026', 'day': 'Tuesday', 'time': '4:02 PM' },
  { 'uid': 8, 'user': 'Frank', 'clockIn': false, 'date': '9/1/2026', 'day': 'Tuesday', 'time': '7:47 PM' },
  { 'uid': 9, 'user': 'Noah', 'clockIn': true, 'date': '9/2/2026', 'day': 'Wednesday', 'time': '8:13 AM' },
  { 'uid': 10, 'user': 'Jackson', 'clockIn': true, 'date': '9/2/2026', 'day': 'Wednesday', 'time': '10:14 AM' },
  { 'uid': 11, 'user': 'Noah', 'clockIn': false, 'date': '9/2/2026', 'day': 'Wednesday', 'time': '4:10 PM' },
  { 'uid': 12, 'user': 'Jackson', 'clockIn': false, 'date': '9/2/2026', 'day': 'Wednesday', 'time': '6:24 PM' },
  { 'uid': 13, 'user': 'Noah', 'clockIn': true, 'date': '9/3/2026', 'day': 'Thursday', 'time': '8:02 AM' },
  { 'uid': 14, 'user': 'Noah', 'clockIn': false, 'date': '9/3/2026', 'day': 'Thursday', 'time': '4:08 PM' }
]

let nextUid = 15

// No user is logged in when the server starts.
let currentUser = null

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)
  } else if (request.method === 'POST') {
    handlePost(request, response)
  } else {
    response.writeHead(405, { 'Content-Type': 'text/plain' })
    response.end('405 Method Not Allowed')
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)

  if (request.url === '/') {
    sendFile(response, 'public/index.html')
  } else if (request.url === '/data') {
    sendJSON(response, appdata)
  } else {
    sendFile(response, filename)
  }
}

const handlePost = function (request, response) {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', function () {
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
    } else if (request.url === '/edit') {
      handleEdit(data, response)
    } else {
      response.writeHead(404, { 'Content-Type': 'text/plain' })
      response.end('404 Error: File Not Found')
    }
  })
}

//Sets the current user. Returns only entries belonging to that user
const handleUserLogin = function (data, response) {
  if (!data.user || data.user.trim() === '') {
    sendJSON(response, { success: false, error: 'Username is required' }, 400)
    return
  }

  currentUser = data.user.trim()
  const userEntries = appdata.filter(function (entry) {
    return entry.user === currentUser
  })

  console.log('User logged in:', currentUser)

  sendJSON(response, { success: true, user: currentUser, entries: userEntries })
}

//Removes the currently logged in user. Returns all entries
const handleUserLogout = function (data, response) {
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
const handleTimeSubmit = function (data, response) {
  if (currentUser === null) {
    sendJSON(response, { success: false, error: 'No user is logged in' }, 401)
    return
  }

  // Validation 
  if (!data.date || !data.time || data.clockIn === undefined) {
    sendJSON(response, { success: false, error: 'Date, time, and clock-in status are required' }, 400)
    return
  }

  const day = getDayOfWeek(data.date)

  if (day === null) { 
    sendJSON(response, { success: false, error: 'Invalid date' }, 400) 
    return 
  }

  const newEntry = {
    uid: nextUid++,
    user: currentUser,
    clockIn: Boolean(data.clockIn),
    date: data.date,
    day: day,
    time: data.time
  }

  // Save the entry. 
  appdata.push(newEntry)

  console.log('New entry:', newEntry)

  const userEntries = appdata.filter(function (entry) {
    return entry.user === currentUser
  })

  sendJSON(response, { success: true, user: currentUser, entries: userEntries })
}

const getDayOfWeek = function (dateString) { 
  const dateParts = dateString.split('/')
  if (dateParts.length !== 3) { return null } 

  const month = parseInt(dateParts[0], 10) 
  const day = parseInt(dateParts[1], 10) 
  const year = parseInt(dateParts[2], 10) 
  const date = new Date(year, month - 1, day) 

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) { return null } 

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
  return days[date.getDay()] 
}


const handleEdit = function (data, response) {

  // User must be logged in to edit
  if (currentUser === null) {
    sendJSON(response, {
      success: false,
      error: 'No user is logged in'
    }, 401)

    return
  }

  if (
    data.uid === undefined ||
    !data.date ||
    !data.time ||
    data.clockIn === undefined
  ) {
    sendJSON(response, {
      success: false,
      error: 'UID, date, time, and clock-in status are required'
    }, 400)

    return
  }

  const entry = appdata.find(function (entry) {
    return entry.uid === data.uid
  })

  //ensure it exists
  if (!entry) {
    sendJSON(response, {
      success: false,
      error: 'Entry not found'
    }, 404)

    return
  }

  // user-specific editting
  if (entry.user !== currentUser) {
    sendJSON(response, {
      success: false,
      error: 'You can only edit your own entries'
    }, 403)

    return
  }

  const day = getDayOfWeek(data.date)

  if (day === null) { 
    sendJSON(response, { success: false, error: 'Invalid date' }, 400) 
    return 
  }

  // Update the existing entry.
  entry.date = data.date
  entry.day = day
  entry.time = data.time
  entry.clockIn = Boolean(data.clockIn)

  console.log('Entry edited:', entry)

  const userEntries = appdata.filter(function (entry) {
    return entry.user === currentUser
  })

  sendJSON(response, {
    success: true,
    user: currentUser,
    entries: userEntries
  })
}


const sendJSON = function (response, data, statusCode = 200) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(data))
}


const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

server.listen(process.env.PORT || port)
