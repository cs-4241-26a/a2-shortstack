// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#yourname' ),
        json = { yourname: input.value },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()

  console.log( 'text:', text )
}

const update = async function() {
  const response = await fetch('/data')
  
  // parse data returned 
  const data = JSON.parse(await response.text())
  
  // get table object for addition
  const table = document.getElementById('table') 
  let tableChildren = []
  
  data.forEach(dataElm => {
    // make row 
    const row       = document.createElement("tr")
    const entry     = document.createElement("td")
    const deadline  = document.createElement("td")
    const priority  = document.createElement("td")
    
    entry.appendChild(document.createTextNode(dataElm.entry))
    deadline.appendChild(document.createTextNode(dataElm.deadline))
    priority.appendChild(document.createTextNode(dataElm.priority))
    
    row.appendChild(entry)
    row.appendChild(deadline)
    row.appendChild(priority)
    
    // table.appendChild(row)
    tableChildren.push(row)
  });
  
  // this overwrites table headers, fix this 
  table.replaceChildren(...tableChildren)
} 

window.onload = function() {
  const time = new Date();
  time.setMinutes(time.getMinutes() - time.getTimezoneOffset())
  document.getElementById("deadline").value = time.toISOString().slice(0, 16)


  const submit_ = document.getElementById('submit')
  submit_.onclick = submit

  const update_ = document.getElementById('refresh')
  update_.onclick = update
  
  update() 
}
