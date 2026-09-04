const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // On Render, make sure `npm install` is your build command.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const gameData = [
  { score: 17, name: "Joe", date: "Mon Aug 31 2026" },
  { score: 34, name: "Peter", date: "Tue Sep 01 2026" },
  { score: 46, name: "Evil Chicken", date: "Wed Sep 02 2026" },
  { score: 51, name: "Jeff", date: "Thur Sep 03 2026" },
];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/getData") {
    console.log(gameData);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(gameData));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    let data = JSON.parse(dataString);

    if (request.url === "/submit") {
      gameData.push(deriveFields(data));
    } else if (request.url === "/delete") {
      const indx = gameData.findIndex(
        (row) =>
          row.name === data.name &&
          row.score === data.score &&
          row.date === data.date,
      );
      if (indx !== -1) gameData.splice(indx, 1);
    }

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });

    // change this to incorporate data
    response.end(JSON.stringify(gameData));
  });
};
const deriveFields = function (row) {
  row.cps = Number((row.score / 10).toFixed(2));
  return row;
};
gameData.forEach(deriveFields);

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
