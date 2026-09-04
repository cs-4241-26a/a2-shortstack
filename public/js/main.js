// FRONT-END (CLIENT) JAVASCRIPT HERE
let ul = null
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const exercise = document.querySelector( '#exercise' ),
        sets = document.querySelector( '#sets' ),
        reps = document.querySelector( '#reps' ),
        json = { exercise: exercise.value, sets: Number(sets.value), reps: Number(reps.value) },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const arr = await response.json()
  ul.innerHTML = ''
  for (const [index, item] of arr.entries()) {
    const li = document.createElement('li')

    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete'
    deleteButton.onclick = function(){
        deleteEntry(index)
    }
    li.innerHTML = `<span class = "exercise-name">${item.exercise}</span> - ${item.sets} x ${item.reps}: Total reps ${item.total_reps}, Total calories Burned: <span class = "calories-burned">${item.calories_burned}</span> `
    li.appendChild(deleteButton)
    ul.appendChild(li)
  }
}

const deleteEntry = async function(index){
  const response = await fetch( '/delete', {
    method:'POST',
    body: JSON.stringify( {index} )
  })
  const arr = await response.json()
  ul.innerHTML = ''
  for (const [index, item] of arr.entries()) {
    const li = document.createElement('li')

    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete'
    deleteButton.onclick = function(){
        deleteEntry(index)
    }
    li.innerHTML = `<span class = "exercise-name">${item.exercise}</span> - ${item.sets} x ${item.reps}: Total reps ${item.total_reps}, Total calories Burned: <span class = "calories-burned">${item.calories_burned}</span> `
    li.appendChild(deleteButton)
    ul.appendChild(li)
  }
}

window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit
  ul = document.createElement('ul')
  document.body.appendChild(ul)
}
