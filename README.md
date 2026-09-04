mini melodies - Assignment 2
===

### Lex Johnson

For project 2, I built a fun little web toy called "mini melodies".
Users can compose a single bar of music using the C major scale, then
submit it to a collection for others to listen to. I learned how to
use the Web Audio API to make a simple synthesizer, which lets users
listen to their music as they compose it. After a melody is
submitted, users can load it in to listen to it, or to edit and
resubmit it. The system also calculates the "vibes" of each melody
using a very advanced method (adding up the eight note values) and
assigns an appropriate adjective, rating your melody on a scale of
"sleepy" to "flamin' hot".

My vision for this project (which I didn't have time to get to before
the deadline) is that the system could use submitted melodies in a
random order to generate a long piece of music. The "vibes" metric
accounts for both the quantity and pitch of the notes, so smoothly
transitioning between melodies with similar vibes might create a
somewhat compelling tune. Maybe I'll come back to this someday and do
that (and also implement a proper database).

## Technical Achievements
- **Single-Page App**: The contents of the database (AKA the collection) are always visible on the same page as the melody maker, and are updated whenever you reload the page or submit a melody.
- **Modifiable Data**: Melodies in the collection can be loaded into the melody maker, modified, and resubmitted with changes.

## Design/Evaluation Achievements
- **Alas**: I didn't have time for any user testing :(
