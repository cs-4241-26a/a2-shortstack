// FRONT-END (CLIENT) JAVASCRIPT HERE

const load = async function () {
  const response = await fetch('/api/data')
  const data = await response.json()

  render(data)
}

const render = function (data) {
  const list = document.querySelector('#list')

  list.innerHTML = ''
  data.forEach(function (row) {
    list.appendChild(cardFor(row))
  })
}

const cardFor = function (row) {
  const li = document.createElement('li')
  li.className = 'card'

  const del = document.createElement('button')
  del.className = 'card__delete'
  del.type = 'button'
  del.textContent = 'X'
  del.dataset.id = row.id
  del.onclick = remove

  const title = document.createElement('h2')
  title.className = 'card__title'
  title.textContent = row.theory

  const verdict = document.createElement('p')
  verdict.className = 'verdict verdict--' + row.verdict.toLowerCase()
  verdict.textContent = row.verdict

  const meter = document.createElement('div')
  meter.className = 'meter'

  const fill = document.createElement('div')
  fill.className = 'meter__fill'
  fill.style.width = (row.exposureOdds * 100).toFixed(1) + '%'
  meter.appendChild(fill)

  li.append(
    del,
    title,
    verdict,
    line(row.conspirators.toLocaleString() + ' conspirators'),
    line(row.yearsRunning + ' years running'),
    meter,
    line((row.exposureOdds * 100).toFixed(1) + '% chance it has leaked'),
    line('expected reveal in ' + formatYears(row.yearsUntilExposed))
  )

  return li
}

const line = function (text) {
  const p = document.createElement('p')
  p.className = 'card__line'
  p.textContent = text

  return p
}

const formatYears = function (years) {
  if (years < 1) return Math.round(years * 12) + ' months'
  if (years < 1000) return years.toFixed(1) + ' years'

  return Math.round(years).toLocaleString() + ' years'
}

const remove = async function (event) {
  const response = await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: Number(event.target.dataset.id) })
  })

  render(await response.json())
}

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const form = document.querySelector('#entryForm'),
    theory = document.querySelector('#theory'),
    conspirators = document.querySelector('#conspirators'),
    yearsRunning = document.querySelector('#yearsRunning')

  const json = {
    theory: theory.value,
    conspirators: Number(conspirators.value),
    yearsRunning: Number(yearsRunning.value)
  }

  const response = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json)
  })

  const data = await response.json()
  render(data)

  form.reset()
  form.hidden = true
}

window.onload = function () {
  const form = document.querySelector('#entryForm'),
    newBtn = document.querySelector('#newBtn'),
    submitBtn = document.querySelector('#submit')

  newBtn.onclick = function () {
    form.hidden = !form.hidden
  }

  submitBtn.onclick = submit

  load()
}
