// FRONT-END (CLIENT) JAVASCRIPT HERE
let score = 0;
var time  = 10;
let intervalId;





const timer = document.getElementById("timer");
const currentScore = document.getElementById("scoreBoard");  
const button = document.getElementById("clicker");
console.log("found", button.textContent);

function editTimer (){
 timer.textContent = `Time left: ${time}`;

   if (--time < 0) {
            time = 10;
        }
}
function startCountDown (){
  intervalId = setInterval(editTimer,1000)

}
button.addEventListener("click", ()=>{
  score++;
  currentScore.textContent = `Score: ${score}`;
  startCountDown();
})



// const submit = async function( event ) {
//   // stop form submission from trying to load
//   // a new .html page for displaying results...
//   // this was the original browser behavior and still
//   // remains to this day
//   event.preventDefault()
  
//   const input = document.querySelector( '#yourname' ),
//         json = { yourname: input.value },
//         body = JSON.stringify( json )

//   const response = await fetch( '/submit', {
//     method:'POST',
//     body 
//   })

//   const text = await response.text()

//   console.log( 'text:', text )
// }

// window.onload = function() {
//   const button = document.querySelector('button')
//   button.onclick = submit
// }
