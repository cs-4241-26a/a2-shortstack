const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000


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
  }else{
    sendFile( response, filename )
  }
}

//updated whenever a POST request comes in
const appdata = [
  {'n1': '2', 'n2': '4', 'res': '7.463422273', 'comment': 'calculated. ', 'id': '0'},
  {"n1": "3", "n2": "5", "res": "14.563386172739277", "comment": "now that's calculation.", "id": "1"},
  {"n1": "4", "n2": "1", "res": "3.879875104369352", "comment": "this is what it's all about", "id": "2"}
]
let nextID = 3
let illustriousness = 3
let editedLast = false

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  let jsonresult = null;

  request.on( 'end', function() {
    jsonresult = JSON.parse( dataString )
    console.log(jsonresult)
    // ... do something with the data here!!!
    //if the data recieved is a new entry:
    if ('n1' in jsonresult) {
        const n1 = parseFloat(jsonresult.n1)
        const n2 = parseFloat(jsonresult.n2)
        if (isNaN(n1) || isNaN(n2)) {
            illustriousness -= 1
            jsonresult["res"] = "NaN"
            jsonresult["comment"] = illustriousComment("nan")
        } else if ((n1 < 0) && (n2 < 0)) {
            illustriousness -= 2
            jsonresult["res"] = "<UNKNOWN>"
            jsonresult["comment"] = illustriousComment("two negatives")
        } else if ((n1 < 0) || (n2 < 0)) {
            illustriousness -= 1
            jsonresult["res"] = "<UNKNOWN>"
            jsonresult["comment"] = illustriousComment("one negative")
        } else {
            illustriousness += 1
            jsonresult["res"] = n1 * n2 + (2 * (Math.random() - 0.5))
            jsonresult["comment"] = illustriousComment("regular")
        }
        jsonresult['id'] = nextID
        nextID += 1
        appdata.push(jsonresult)
    } else if ('delete' in jsonresult) { //if it's a delete request:
        let index = 0
        //traverse appdata, find one with matching id to the id we're deleting
        for (item in appdata) {
            if (appdata[item]["id"] === jsonresult.delete) {break}
            else {index += 1}
        }
        //remove the item to be deleted
        appdata.splice(index, 1)
    } else if ('editid' in jsonresult) { //if it's an edit request:
        let index = 0
        //traverse appdata, find one with matching id to the id we're editing
        for (item in appdata) {
            if (appdata[item]["id"] === jsonresult.editid) {break}
            else {index += 1}
        }
        appdata[index]["res"] = jsonresult.newVal
        illustriousness -= 1
        editedLast = true
    }
    //even if the data won't parse, return the current state of the server

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })

    // change this to incorporate data
    response.end(JSON.stringify(appdata))
  })
}

const illustriousComment = function(type) {
    if (editedLast) {
        editedLast = false
        return "you edited one of my calculations...did i do something wrong?"
    } 
    else if (type === "nan") {
        if (illustriousness >= 3) {return "one of these isn't a number, but we all make mistakes sometimes. "}
        else if (illustriousness >= 0) {return "sorry, just can't calculate with non-numbers. "}
        else {return "they're not even numbers...what am i supposed to do..."}
    }
    else if (type === "one negative") {
        if (illustriousness >= 3) {return "a negative number? sorry, i have to step away for a moment"}
        else if (illustriousness >= 0) {return "it's negative? oh no. i'm sorry about this..."}
        else {return "what kind of calculator can't handle a negative number? i'm a failure..."}
    }
    else if (type === "two negatives") {
        if (illustriousness >= 3) {return "two? two negative numbers? i need a coffee break. "}
        else if (illustriousness >= 0) {return "they're so negative...i never stood a chance..."}
        else {return "both are negative numbers...i don't even want to think about them..."}
    }
    else if (type === "regular") {
        if (illustriousness >= 3) {return "i love calculating numbers!"}
        else if (illustriousness >= 0) {return "ahh, nice pure calculating."}
        else {return "thank god, normal numbers."}
    }
    else {
        return "oh no. "
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
