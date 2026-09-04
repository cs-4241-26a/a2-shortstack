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
        document.getElementById("play").disabled = true
        let note = melody.shift()
        playNote(note, playMelody)
    } else {
        document.getElementById("play").disabled = false
    }
}

/**
 * Populates the melody with the form values.
 */
function makeMelody() {
    melody.length = 0 // Clear the melody
    for (let i = 0; i < 8; i++) {
        melody[i] = document.getElementById("note-input-" + i).value
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
async function submitButton(event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    makeMelody();
    const titleInput = document.getElementById("title-input"),
        composerInput = document.getElementById("composer-input");
    const json = {
        title: titleInput.value,
        composer: composerInput.value,
        melody: melody
    }
    const body = JSON.stringify(json)
    console.log("Body: " + body)

    const response = await fetch('/submit', {
        method:'POST',
        body: body
    })

    const text = await response.text()
    console.log('Response from server:', text)
}

window.onload = function() {
    document.getElementById("play").onclick = playButton
    document.getElementById("submit").onclick = submitButton

    let melodyInput = document.getElementById("melody")
    for (let i = 0; i < 8; i++) {
        let noteInput = document.createElement("input");
        noteInput.id = "note-input-" + i;
        noteInput.className = "note-input"
        noteInput.type = "number"
        noteInput.min = "0";
        noteInput.max = "8";
        noteInput.value = "0";
        noteInput.onchange = function() {
            playNote(noteInput.value)
        }
        melodyInput.appendChild(noteInput);
    }
}
