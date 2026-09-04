// FRONT-END (CLIENT) JAVASCRIPT HERE

let editingId = null

const displayWorkouts = function( workouts ) {
  const results = document.querySelector( '#workout-results' )

  results.innerHTML = ''

  workouts.forEach( function( workout ) {
    const row = document.createElement( 'tr' )

    row.innerHTML = `
      <td>${ workout.exercise }</td>
      <td>${ workout.sets }</td>
      <td>${ workout.reps }</td>
      <td>${ workout.weight } lb</td>
      <td>${ workout.volume } lb</td>
      <td>
        <button class='edit-button'
                data-id='${ workout.id }'
                data-exercise='${ workout.exercise }'
                data-sets='${ workout.sets }'
                data-reps='${ workout.reps }'
                data-weight='${ workout.weight }'>
          Edit
        </button>
        <button class='delete-button'
                data-id='${ workout.id }'>
          Delete
        </button>
      </td>
    `

    results.appendChild( row )
  })

  const editButtons = document.querySelectorAll( '.edit-button' )
  const deleteButtons = document.querySelectorAll( '.delete-button' )

  editButtons.forEach( function( button ) {
    button.onclick = editWorkout
  })

  deleteButtons.forEach( function( button ) {
    button.onclick = deleteWorkout
  })
}

const getWorkouts = async function() {
  const response = await fetch( '/data' ),
        workouts = await response.json()

  displayWorkouts( workouts )
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const exercise = document.querySelector( '#exercise' ),
        sets     = document.querySelector( '#sets' ),
        reps     = document.querySelector( '#reps' ),
        weight   = document.querySelector( '#weight' ),
        json     = {
          exercise: exercise.value,
          sets: sets.value,
          reps: reps.value,
          weight: weight.value
        }

  let url = '/submit'

  if( editingId !== null ) {
    url = '/update'
    json.id = editingId
  }

  const body = JSON.stringify( json )

  const response = await fetch( url, {
    method:'POST',
    body 
  })

  const workouts = await response.json()

  displayWorkouts( workouts )

  document.querySelector( '#workout-form' ).reset()

  editingId = null
  document.querySelector( '#submit-button' ).textContent = 'Add Exercise'
}

const deleteWorkout = async function( event ) {
  const json = { id: event.target.dataset.id },
        body = JSON.stringify( json )

  const response = await fetch( '/delete', {
    method:'POST',
    body
  })

  const workouts = await response.json()

  displayWorkouts( workouts )
}

const editWorkout = function( event ) {
  const button = event.target

  editingId = button.dataset.id

  document.querySelector( '#exercise' ).value = button.dataset.exercise
  document.querySelector( '#sets' ).value = button.dataset.sets
  document.querySelector( '#reps' ).value = button.dataset.reps
  document.querySelector( '#weight' ).value = button.dataset.weight

  document.querySelector( '#submit-button' ).textContent = 'Update Exercise'
}

window.onload = function() {
  const button = document.querySelector( '#submit-button' )

  button.onclick = submit

  getWorkouts()
}