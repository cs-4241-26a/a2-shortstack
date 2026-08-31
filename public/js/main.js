// FRONT-END (CLIENT) JAVASCRIPT HERE
let score = 0;
var time = 9;
let hasRun = false;
let intervalId;

const timer = document.getElementById("timer");
const currentScore = document.getElementById("scoreBoard");
const button = document.getElementById("clicker");
const sumbitScore = document.getElementById("sumbitScore");

console.log("found", button.textContent);

function editTimer() {
  timer.textContent = `TME LEFT: ${time}`;
  time--;
  if (time < 0) {
    clearInterval(intervalId);
    button.style.visibility = "hidden";
    sumbitScore.style.visibility = "visible";
  }
}
function startCountDown() {
  intervalId = setInterval(editTimer, 1000);
}
button.addEventListener("click", () => {
  score++;
  currentScore.textContent = `Score: ${score}`;

  if (!hasRun) {
    hasRun = true;
    startCountDown();
  }
});
sumbitScore.addEventListener("input", (event)=>{
  event.preventDefault();
})
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const input = document.getElementById("nameScore"),
        json = { name: input.value, score: score },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body
  })

  const text = await response.text()

  console.log( 'text:', text )
}

window.onload = function() {
  sumbitScore.onclick = submit
}
// fetch('/sumbit').then(response => response.json()).then(data=>{
//   let leaderBoard = document.getElementById("leaderBoard")
//   leaderBoard.
// }

// )