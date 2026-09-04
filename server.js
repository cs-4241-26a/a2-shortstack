const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // On Render, make sure `npm install` is your build command.
    mime = require("mime"),
    dir = "public/",
    port = 3000;

const appdata = [];

const server = http.createServer(function (request, response) {
    if (request.method === "GET") {
        handleGet(request, response);
    } else if (request.method === "POST") {
        handlePost(request, response);
    } else if (request.method === "DELETE") {
        handleDelete(request, response);
    } else if (request.method === "PUT") {
        handleModify(request, response);
    }
});

const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1);

    if (request.url === "/") {
        sendFile(response, "public/index.html");
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
        const data = JSON.parse(dataString);
        // ... do something with the data here!!!
        //calculates priority level of assignment depending on
        //current date in relation to due date and how major the
        //assignment is like an exam or project
        const deadline = data.deadline;
        const dueDate = new Date(deadline);
        const currentDate = new Date();
        const days = (dueDate - currentDate) / (1000 * 60 * 60 * 24);
        let priority;
        if ((days <= 3 && data.category === "Exam") || data.category === "Project") {
            priority = "Urgent";
        } else {
            priority = "Not Urgent";
        }
        data.priority = priority;
        appdata.push(data);
        response.writeHead(200, "OK", { "Content-Type": "text/plain" });

        // change this to incorporate data
        response.end(JSON.stringify(appdata));
    });
};
const handleDelete = function (request, response) {
    const index = Number(request.url.split("/")[2]);

    if (index >= 0 && index < appdata.length) {
        appdata.splice(index, 1);

        response.writeHead(200, {
            "Content-Type": "application/json",
        });

        response.end(JSON.stringify(appdata));
    } else {
        response.writeHead(404);
        response.end("Task not found");
    }
};

const handleModify = function (request, response) {
    const index = Number(request.url.split("/")[2]);
    let dataString = "";

    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        if (index < 0 || index >= appdata.length) {
            response.writeHead(404);
            response.end("Task not found");
            return;
        }

        const modifiedItem = JSON.parse(dataString);

        const dueDate = new Date(modifiedItem.deadline);
        const currentDate = new Date();

        const days = (dueDate - currentDate) / (1000 * 60 * 60 * 24);

        if (days <= 3 && (data.category === "Exam" || data.category === "Project")) {
            modifiedItem.priority = "Urgent";
        } else {
            modifiedItem.priority = "Not Urgent";
        }

        // Replace the old item with the modified item
        appdata[index] = modifiedItem;

        response.writeHead(200, {
            "Content-Type": "application/json",
        });
        response.end(JSON.stringify(appdata));
    });
};

const sendFile = function (response, filename) {
    const type = mime.getType(filename);

    fs.readFile(filename, function (err, content) {
        // if the error = null, then we've loaded the file successfully
        if (err === null) {
            // status code: https://httpstatuses.com
            response.writeHead(200, { "Content-Type": type });
            response.end(content);
        } else {
            // file not found, error code 404
            response.writeHead(404);
            response.end("404 Error: File Not Found");
        }
    });
};

server.listen(process.env.PORT || port);
