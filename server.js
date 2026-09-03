const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000
const appdata = [
  { 'name': 'Yordan Alvarez', 'avg': 0.317, 'obp': 0.433, 'slg': 0.604 },
  { 'name': 'Mike Trout', 'avg': 0.239, 'obp': 0.375, 'slg': 0.423 },
  { 'name': 'Juan Soto', 'avg': 0.281, 'obp': 0.402, 'slg': 0.542 },
]

//const appdata = []
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

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    if (dataString !== '' && dataString !== undefined) {
      appdata.push( JSON.parse( dataString ) )
    }
    //console.log('appdata:', appdata);
    // ... do something with the data here!!!
    const names = []
    let flag = false
    const removal = []
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    for (let i = appdata.length - 1; i >= 0; i--) {
      const item = appdata[i];
      if (item.avg == 'remove') {
        removal.push(item.name);
        appdata.splice(i, 1);
      }
      else if (removal.includes(item.name)) {
        appdata.splice(i, 1);
      }
    }
    for (let i = 0; i < appdata.length; i++) {
      const item = appdata[i];
      if (item.name === '') {
        appdata.splice(i, 1);
        i--;
      }
      else if (item.avg > 1 || item.avg < 0 || item.obp > 1 || item.obp < 0 || item.slg > 4 || item.slg < 0) {
        appdata.splice(i, 1);
        i--;
      }
      else if (names.includes(item.name)) {
        //alert('Player already exists in the table!');
        var duplicateIndex = names.indexOf(item.name);
        if (item.avg > 0 && item.obp > 0 && item.slg > 0 && item.avg < 1 && item.obp < 1 && item.slg < 4) {
          appdata[duplicateIndex] = item;
        }
        flag = true;
      }
        
      else {
        names.push(item.name);
      }
    }
    if (flag) {
      appdata.pop()
    }
    // change this to incorporate data
    response.end( JSON.stringify( appdata ) )
    /**
     *    let arr = appdata
  for (let item of arr) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = '';
    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    newRow.appendChild(nameCell);
    const avgCell = document.createElement('td');
    avgCell.textContent = parseFloat(item.avg).toFixed(3);
    newRow.appendChild(avgCell);
    const obpCell = document.createElement('td');
    obpCell.textContent = parseFloat(item.obp).toFixed(3);
    newRow.appendChild(obpCell);
    const slgCell = document.createElement('td');
    slgCell.textContent = parseFloat(item.slg).toFixed(3);
    newRow.appendChild(slgCell);
    const opsCell = document.createElement('td');
    const opsValue = (parseFloat(item.obp) + parseFloat(item.slg)).toFixed(3);
    opsCell.textContent = opsValue;
    newRow.appendChild(opsCell);
    tableBody.appendChild(newRow);
  }
     */
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
