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

  const text = await response.text()
  update(text)
  console.log( 'text:', text )
}

// function that updates the list! 
function update(text) {
  const parsed = JSON.parse(text)
  const results = document.getElementById("results")

  let list_entries = []
  let i = 0; // index for use with delete 
  parsed.forEach(element => {
    const entry = document.createElement("template")
    entry.innerHTML = 
    `<tr> 
    <td>${element.q0}</td> 
    <td>${element.q1}</td>
    <td>${element.q2}</td>
    <td>${element.q3}</td>
    <td class="verdict">${element.q4}.</td>
    <td><button onclick="del(${i})" class="del">delete</button></td>
    </tr>`
    list_entries.push(entry.content.firstChild)
    i++
  });
  results.replaceChildren(...list_entries)
}

const del = async function(i) {
  console.log("welcome to the deletion zone")
  json = {"index" : i}
  body = JSON.stringify(json)
    const response = await fetch( `/delete`, {
    method:'POST',
    body
  })

  console.log("we remain in the deletion zone")
  const text = await response.text()
  update(text)
}


window.onload = function() {
  const sub_button = document.querySelector('#submit')
  sub_button.onclick = submit
}
