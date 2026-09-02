// Frequencies of the C major scale using just intonation with C as the fundamental
const frequencies = {
    "0": 0, // 0 means a rest
    "1": 261.62,
    "2": 294.32,
    "3": 327.02,
    "4": 348.83,
    "5": 392.43,
    "6": 436.03,
    "7": 490.54,
    "8": 523.24
}

// List of notes to play
let melody = []

/**
 * Plays the specified note for 1 eighth note (0.25 seconds).
 * @param note Integer representing the note to play
 * @param callback Function to call once the note has finished playing
 */
function playNote(note, callback) {
    const audioContext = new AudioContext();
    const oscNode = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscNode.frequency.value = frequencies[note];
    oscNode.type = 'triangle'
    oscNode.onended = callback // Used to play the next notes in the melody once this one's done

    // Make a nice envelope for each note to prevent popping at the end of notes
    gainNode.gain.value = 0
    gainNode.gain.linearRampToValueAtTime(0.3, 0.01)
    gainNode.gain.linearRampToValueAtTime(0, 0.25)

    oscNode.start()
    oscNode.stop(0.25)
}

/**
 * Plays all notes currently in the melody.
 */
function playMelody() {
    if (melody.length > 0) {
        let note = melody.shift()
        playNote(note, playMelody)
    }
}

/**
 * Populates the melody with the form values.
 */
function makeMelody() {
    for (let i = 1; i <= 8; i++) {
        const note = document.getElementById("note" + i).value;
        melody.push(note)
    }
}

/**
 * Called when the play button is pressed.
 */
function playButton(event) {
    event.preventDefault()
    makeMelody()
    playMelody()
}

/**
 * Called when the submit button is pressed.
 */
const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    const input = document.querySelector( '#yourname' ),
        json = { yourname: input.value },
        body = JSON.stringify( json )

    const response = await fetch( '/submit', {
        method:'POST',
        body
    })

    const text = await response.text()

    console.log( 'text:', text )
}

window.onload = function() {

}
