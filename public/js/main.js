// FRONT-END (CLIENT) JAVASCRIPT HERE
let table = null
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

    //get data values
  const input = document.querySelector( '#showname' ),
      episodeswatched = document.querySelector( '#episodeswatched' ),
      total = document.querySelector( '#episodecount' ),

        json = {
          show: input.value,
          watched: Number(episodeswatched.value),
          total: Number(total.value),
        },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body
  })

  const arr = await response.json()

    displayTable(arr)
    //logging array for debugging
  console.log( arr )
}

window.onload = async function() {
  const button = document.querySelector('button')
  button.onclick = submit
    //get table
  table = document.querySelector('#showresults')
  const response = await fetch( '/results', {
    method:'GET'
  })
  const arr = await response.json()
    //display example data
    displayTable(arr)

}
//deletes a specific show with its index
const deleteShow = async function( index ) {
    const json = {
        index: index
    }
    const body = JSON.stringify( json )
    //sends info to server
    const response = await fetch( '/delete', {
        method:'POST',
        body
    })
    //display updated data
    const arr = await response.json()
    displayTable(arr)
}
//used to dispaly the table through the program
const displayTable = function (arr) {
    table.innerHTML = ''
    for (let i = 0; i < arr.length; i++) {
        const show = arr[i]
        const tr = document.createElement('tr')
        //show information
        tr.innerHTML=`
            <td>${i+1}</td>
            <td>${show.show}</td>
            <td>${show.watched}</td>
            <td>${show.total}</td>
            <td>${show.percent}</td>
        `
        //delete button per row
        const deleteButton = document.createElement('button')
        const deleteCell = document.createElement('td')
        deleteButton.innerText = 'Delete'
        deleteButton.onclick = function (){deleteShow(i)}
        deleteCell.appendChild(deleteButton)
        tr.appendChild(deleteCell)
        table.appendChild(tr)
    }
}
