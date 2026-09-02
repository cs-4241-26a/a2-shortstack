// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  // user information
  const name = document.querySelector( '#user_name' ).value;
  const birth_year = document.querySelector( '#birth_year' ).value;
  const user_class = document.querySelector( '#user_class' ).value;


  let user_info = {
    name: name,
    birth_year: Number(birth_year),
    user_class: user_class,
  };

  const response = await fetch( '/submit', {
    method:'POST',
    body: JSON.stringify(user_info)
  });

  const data = await response.json();
  console.log( 'data:', data );
}

const fetchInfo = async function() {
  const response = await fetch('/users');
  const users = await response.json();
  console.log(users);
}

window.onload = async function() {
  const form = document.querySelector('form');
  form.onsubmit = submit;
  await fetchInfo();
}
