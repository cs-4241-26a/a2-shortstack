// FRONT-END (CLIENT) JAVASCRIPT HERE

let ul

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const json = { name: document.querySelector('#itemname').value,  
    price: document.querySelector('#itemprice').value, 
    tasty: document.querySelector('#itemgood').value}
  const body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  let arr = await response.text()
  arr = JSON.parse(arr)

  ul.innerHTML = ''
  for (let item of arr) {
    const li = document.createElement('li')
    li.innerText = "Name: " + item.name + " Price: $" + item.price + " Tasty?: " + item.tasty + " Worth?: " + item.worth
    ul.appendChild(li)
  }
}

window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit
  ul = document.createElement('ul')
  document.body.appendChild(ul)
}
