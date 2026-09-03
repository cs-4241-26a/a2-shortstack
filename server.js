const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // On Render, make sure `npm install` is your build command.
  mime = require('mime'),
  dir = 'public/',
  port = 3000

const appdata = {
  'times': [
    { 'name': 'test', 'ms': 30, 'time': 0 },
    { 'name': 'test', 'ms': 50, 'time': 1 },
    { 'name': 'test', 'ms': 85, 'time': 2 },
  ],
  'averages': { "test": { 'name': 'test', 'n': 3, 'tot': 165, 'avg': 55 } },
}

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)
  } else if (request.method === 'POST') {
    handlePost(request, response)
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)

  if (request.url === '/') {
    sendFile(response, 'public/index.html')
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
    let data = JSON.parse(dataString)
    console.log(data)
    if (data.name != "") {
      appdata.times.push(data)
      appdata.averages = {}
      for (let i = 0; i < appdata.times.length; i++) {
        const item = appdata.times[i]
        console.log(JSON.stringify(item))
        usrname = item.name
        if (!(usrname in appdata.averages)) {
          appdata.averages[usrname] = { 'name': usrname, 'n': 0, 'tot': 0, 'avg': 0 }
        }
        console.log(item.ms)
        avgData = appdata.averages[usrname]
        avgData.n++
        avgData.tot += item.ms
        avgData.avg = avgData.tot / avgData.n
        console.log("avg:" + JSON.stringify(avgData))
      }
    }
    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })

    // change this to incorporate data
    response.end(JSON.stringify(appdata))
  })
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
