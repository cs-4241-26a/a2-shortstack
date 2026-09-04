const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let notesData = []; // Array to store notes in server memory

const server = http.createServer(function(request, response) {
  if (request.method === 'GET') {
    handleGet(request, response);
  } else if (request.method === 'POST') {
    handlePost(request, response);
  } else if (request.method === 'DELETE') {
    handleDelete(request, response);
  }
});

const handleGet = function(request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === '/') {
    sendFile(response, 'public/index.html');
  } else if (request.url === '/notes') {
    // Send the current notes data to the client
    response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(notesData));
  } else {
    sendFile(response, filename);
  }
}

const handlePost = function(request, response) {
  let dataString = '';
  request.on('data', function(data) { dataString += data; });

  request.on('end', function() {
    if (request.url === '/submit') {
      const newNote = JSON.parse(dataString);

      let days = 7; // Default to low
      if (newNote.urgency === 'high') {
        days = 1;
      } else if (newNote.urgency === 'medium') {
        days = 3;
      }

      let date = new Date();
      date.setDate(date.getDate() + days);
      newNote.deadline = date.toLocaleDateString(); // Attach derived field

      notesData.push(newNote);

      response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(notesData));

    } else if (request.url === '/update') {
      const updatedNote = JSON.parse(dataString);

      let days = 7; // Default to low
      if (updatedNote.urgency === 'high') {
        days = 1;
      } else if (updatedNote.urgency === 'medium') {
        days = 3;
      }

      let date = new Date();
      date.setDate(date.getDate() + days);
      updatedNote.deadline = date.toLocaleDateString(); // Attach derived field

      // Update the specific note in server memory
      notesData[updatedNote.index] = {
        title: updatedNote.title,
        content: updatedNote.content,
        urgency: updatedNote.urgency,
        deadline: updatedNote.deadline
      };

      response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(notesData));
    }
  });
}

const handleDelete = function(request, response) {
  let dataString = '';
  request.on('data', function(data) { dataString += data; });

  request.on('end', function() {
    if (request.url === '/delete') {
      const data = JSON.parse(dataString);
      notesData.splice(data.index, 1); // Remove the note at the specified index

      // Send the updated array back
      response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(notesData));
    }
  });
}

const sendFile = function(response, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, function(err, content) {
    if (err === null) {
      response.writeHead(200, { 'Content-Type': type });
      response.end(content);
    } else {
      response.writeHead(404);
      response.end('404 Error: File Not Found');
    }
  });
}

server.listen(process.env.PORT || port);