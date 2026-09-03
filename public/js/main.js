// FRONT-END (CLIENT) JAVASCRIPT HERE

let timeList = null
let avgList = null
let reactBtn = null
let nameBtn = null
let usrname = ""

const reactStates = {
  idle: 0,
  wait: 1,
  press: 2,
}

let reactState = reactStates["idle"]
let timeInState = 0

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  usrname = document.querySelector('#yourname').value

  // Temp
  const time = Math.floor(((Math.random() * 200))) + 200

  json = { name: usrname, ms: time, time: Date.now() },
    body = JSON.stringify(json)

  const response = await fetch('/submit', {
    method: 'POST',
    body
  })
  const arr = await response.json()
  updateLists(arr)
  console.log('arr:', arr)
}

/* Sends and fetches data from server; sending empty name field results in no stored data 
    name: user input name
    ms: reaction time
    time: current local time (unique per user)*/
async function transferData(name, ms, time) {

}

// Updates time and average time lists
function updateLists(arr) {
  timeList.innerHTML = ''
  for (let n = arr.times.length - 1; n >= 0; n--) {
    const item = arr.times[n]
    const li = document.createElement('li')
    li.innerHTML = `<button type="button" class="editBtn" data-timestamp="${item.time}">✏️</button>
                  <button type="button" class="deleteBtn" data-timestamp="${item.time}">🗑️</button>
                   ${item.name}: ${item.ms}ms`
    timeList.appendChild(li)
  }
  avgList.innerHTML = ''
  for (item of Object.values(arr.averages)) {
    const li = document.createElement('li')
    li.innerHTML = `<button type="button" class="deleteBtn" data-timestamp="${item.time}">🗑️</button>
                  ${item.name} Avg: ${item.avg}ms`
    avgList.appendChild(li)
  }
}

window.onload = function () {
  reactBtn = document.querySelector('#reactBtn')
  // nameBtn = document.querySelector('#yournameBtn')
  reactBtn.onclick = submit
  // nameBtn.onclick = function () {
  //   usrname = document.querySelector('#yourname').value
  // }
  timeList = document.querySelector('#timeList')
  avgList = document.querySelector('#avgList')
  reactBtn.click()
}
