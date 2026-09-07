// FRONT-END (CLIENT) JAVASCRIPT HERE

// the async keyword is for things that will take an unclear amount of time...
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const q0 = document.querySelector( '#q0' ),
        q1 = document.querySelector('#q1'),
        q2 = document.querySelector('#q2'),
        q3 = document.querySelector('#q3'),
        json = { 
          q0: q0.value,
          q1: q1.value,
          q2: q2.value,
          q3: q3.value, 
         },
        body = JSON.stringify( json )

  // and then we can await async stuff !
  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  console.log(body)
  const text = await response.text()
  update(text)
  console.log( 'text:', text )
}

// function that updates the list! 
function update(text) {
  console.log("text (in update) " + text)
  const parsed = JSON.parse(text)
  const results = document.getElementById("results")

  let list_entries = []
  parsed.forEach(element => {
    const entry = document.createElement("template")
    entry.innerHTML = `<li>The animal, ${element.q0}, is a ${element.q4}.</li>`
    list_entries.push(entry.content.firstChild)
  });
  results.replaceChildren(...list_entries)
}


window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit
}
