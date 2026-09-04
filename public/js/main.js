// FRONT-END (CLIENT) JAVASCRIPT HERE
let newRow = null;
const globalArr = [];
const submit = async function( event ) {
  const tableBody = document.querySelector('#table-body');
  event.preventDefault()
  const namePlayer = document.querySelector('#name');
  const avg = document.querySelector('#avg');
  const obp = document.querySelector('#obp');
  const slg = document.querySelector('#slg')
  if (namePlayer.value === '' || avg.value === '' || obp.value === '' || slg.value === '') {
    alert('Please fill in all fields before submitting.');
    return;
  }
  if (isNaN(avg.value) || isNaN(obp.value) || isNaN(slg.value) || avg.value < 0 || avg.value > 1 || obp.value < 0 || obp.value > 1 || slg.value < 0 || slg.value > 4 || avg.value > slg.value || (obp.value == 0 && (avg.value > 0 || slg.value > 0))) {
    alert('Please enter valid numbers for AVG, OBP, and SLG.');
    return;
  }
  populateTable();

};

window.onload = async function() {
 populateTable2();
  const button = document.querySelector('#AddPlayer')
  const removeButton = document.querySelector('#RemovePlayer')
  button.onclick = submit
  removeButton.onclick = remove
}

async function populateTable() {
  const namePlayer = document.querySelector('#name');
  const tableBody = document.querySelector('#table-body');
  const input = document.querySelector( '#name' ),
        input2 = document.querySelector( '#avg' ),
        input3 = document.querySelector( '#obp' ),
        input4 = document.querySelector( '#slg' ),
        json = { name: input.value, avg: input2.value, obp: input3.value, slg: input4.value },
        body = JSON.stringify( json )
  
  //const newRow = document.createElement('tr');
  const response = await fetch( '/submit', {
    method:'POST',
    body
  })
  //console.log('body:', body);
  //console.log('response:', json);
  const arr = await response.json()
  //console.log('arr after meeting server:', arr);
  //console.log('player name: ', namePlayer.value);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].name === namePlayer.value) {
      alert('Player already exists in the table! The player will be updated with the new stats.');
      arr.splice(i); // Remove the duplicate player from the array
      return;
    }
  }
  //console.log('arr:', arr);
  //newRow.innerHTML = '';
  let item = arr[arr.length - 1];
  //for (let item of arr) {
  if (item.name !== '') {
    if (!(globalArr.includes(item))) {
      globalArr.push(item);
    }
    const newRow = document.createElement('tr');
    newRow.innerHTML = '';
    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    newRow.appendChild(nameCell);
    const avgCell = document.createElement('td');
    avgCell.textContent = parseFloat(item.avg).toFixed(3);
    newRow.appendChild(avgCell);
    const obpCell = document.createElement('td');
    obpCell.textContent = parseFloat(item.obp).toFixed(3);
    newRow.appendChild(obpCell);
    const slgCell = document.createElement('td');
    slgCell.textContent = parseFloat(item.slg).toFixed(3);
    newRow.appendChild(slgCell);
    const opsCell = document.createElement('td');
    const opsValue = (parseFloat(item.obp) + parseFloat(item.slg)).toFixed(3);
    opsCell.textContent = opsValue;
    newRow.appendChild(opsCell);
    tableBody.appendChild(newRow);
  }
}

async function populateTable2() {
  const namePlayer = document.querySelector('#name');
  const tableBody = document.querySelector('#table-body');
  const json = { name: '' },
        body = JSON.stringify( json )
  //const newRow = document.createElement('tr');
  const response = await fetch( '/submit', {
    method:'POST',
    body
  })
  //console.log('body:', body);
  //console.log('response:', json);
  const arr = await response.json()
  //console.log('arr:', arr);
  //newRow.innerHTML = '';
  //let item = arr[arr.length - 1];
  for (let item of arr) {
    //let item = arr[i];
    if (item.name !== '' && item.name !== undefined) {
      globalArr.push(item);
      const newRow = document.createElement('tr');
      newRow.innerHTML = '';
      const nameCell = document.createElement('td');
      nameCell.textContent = item.name;
      newRow.appendChild(nameCell);
      const avgCell = document.createElement('td');
      avgCell.textContent = parseFloat(item.avg).toFixed(3);
      newRow.appendChild(avgCell);
      const obpCell = document.createElement('td');
      obpCell.textContent = parseFloat(item.obp).toFixed(3);
      newRow.appendChild(obpCell);
      const slgCell = document.createElement('td');
      slgCell.textContent = parseFloat(item.slg).toFixed(3);
      newRow.appendChild(slgCell);
      const opsCell = document.createElement('td');
      const opsValue = (parseFloat(item.obp) + parseFloat(item.slg)).toFixed(3);
      opsCell.textContent = opsValue;
      newRow.appendChild(opsCell);
      tableBody.appendChild(newRow);
    }
  }
}

const remove = async function( event ) {
  event.preventDefault()
  const playerName = document.querySelector('#remove').value;
  if (playerName === '') {
    alert('Please enter a player name to remove.');
    return;
  }
  
  //console.log('player name to remove: ', playerName);
  //console.log('globalArr before removal:', globalArr);
  let found = false;
  //console.log('found before loop:', found);
  for (let item of globalArr) {
    if (item.name === playerName) {
      globalArr.splice(globalArr.indexOf(item), 1);
      found = true;
      break;
    }
  }
  //console.log('found after loop:', found);
  if (!found) {
    alert('Player not found in the table.');
    return;
  }
    
  removePlayer(playerName);
  //document.getElementById()
  const json = { name: playerName, avg: 'remove' },
        body = JSON.stringify( json )
  //const newRow = document.createElement('tr');
  const response = await fetch( '/submit', {
    method:'POST',
    body
  })

}
function removePlayer(name) {
  const tableBody = document.querySelector('#table-body');
  const rows = tableBody.querySelectorAll('tr');
  for (let i = 0; i < rows.length; i++) {
    const nameCell = rows[i].querySelector('td:first-child');
    if (nameCell && nameCell.textContent === name) {
      tableBody.removeChild(rows[i]);
      break;
    }
  }
}