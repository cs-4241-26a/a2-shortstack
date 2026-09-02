const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let nextId = 1

const expenses = [
  { id: nextId++, description: 'Coffee', category: 'Food', amount: 4.50 },
  { id: nextId++, description: 'Bus pass', category: 'Transport', amount: 30 },
  { id: nextId++, description: 'Movie ticket', category: 'Entertainment', amount: 15 }
]

// Derived field: computed from amount, added to every expense
const addDerivedField = function( expense ) {
  if( expense.amount < 10 ) {
    expense.spendLevel = 'Low'
  } else if( expense.amount <= 50 ) {
    expense.spendLevel = 'Medium'
  } else {
    expense.spendLevel = 'High'
  }
  return expense
}

// add spendLevel to the starting data too
expenses.forEach( addDerivedField )

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }else if( request.method === 'POST' ){
    handlePost( request, response )
  }
})

const handleGet = function( request, response ) {
  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if( request.url === '/expenses' ) {
    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( expenses ) )
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
    const data = JSON.parse( dataString )

    if( request.url === '/add' ) {
      const newExpense = {
        id: nextId++,
        description: data.description,
        category: data.category,
        amount: parseFloat( data.amount )
      }
      addDerivedField( newExpense )
      expenses.push( newExpense )
    }else if( request.url === '/delete' ) {
      const index = expenses.findIndex( function( e ) { return e.id === data.id })
      if( index !== -1 ) {
        expenses.splice( index, 1 )
      }
    }else if( request.url === '/edit' ) {
      const expense = expenses.find( function( e ) { return e.id === data.id })
      if( expense ) {
        expense.description = data.description
        expense.category = data.category
        expense.amount = parseFloat( data.amount )
        addDerivedField( expense )
      }
    }

    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( expenses ) )
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename )

   fs.readFile( filename, function( err, content ) {
     if( err === null ) {
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )
     }else{
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )
     }
   })
}

server.listen( process.env.PORT || port )