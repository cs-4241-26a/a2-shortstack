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

  await fetchInfo();
}

const deleteUser = async function(name) {
  const response = await fetch(`/users/${name}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log(data);
}

const fetchInfo = async function() {
  const response = await fetch('/users');
  const users = await response.json();
  console.log(users);

  // add users to table yayyy
  const age_table_body = document.querySelector('#age_table_body');
  age_table_body.innerHTML = '';
  users.forEach(function(user) {
    const row = document.createElement('tr');
    const name_cell = document.createElement('td');
    name_cell.textContent = user.name;
    const class_cell = document.createElement('td');
    class_cell.textContent = user.user_class;
    const birth_year_cell = document.createElement('td');
    birth_year_cell.textContent = user.birth_year;
    const age_cell = document.createElement('td');
    age_cell.textContent = user.age;
    const delete_cell = document.createElement('td');
    const delete_button = document.createElement('button');
    delete_button.textContent = 'Delete';
    delete_button.addEventListener('click', async function() {
      await deleteUser(user.name);
      await fetchInfo();
    });
    delete_cell.appendChild(delete_button);
    row.appendChild(name_cell);
    row.appendChild(class_cell);
    row.appendChild(birth_year_cell);
    row.appendChild(age_cell);
    row.appendChild(delete_cell);
    age_table_body.appendChild(row);
  });
  
}

window.onload = async function() {
  const form = document.querySelector('form');
  form.onsubmit = submit;
  await fetchInfo();
}
