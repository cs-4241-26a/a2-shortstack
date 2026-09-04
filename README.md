## Shubham's Workout Tracker

**Live Site:** https://a2-shubhamkumar.onrender.com/

Workout Tracker is a single-page web application that allows users to log strength-training exercises and view the current workout dataset stored on the server. Users can add, edit, and delete workout entries. The server automatically calculates total training volume using the formula `sets × reps × weight`.

## Technical Achievements
- **Tech Achievement 1**: Created a single-page application that allows users to submit workout data and immediately view the updated server-side dataset without reloading the page. The client uses `fetch()` to communicate with the Node.js server, and the server returns the updated dataset after each request.

- **Tech Achievement 2**: Added the ability to modify existing workout entries. Clicking the Edit button loads the workout data back into the form, and submitting the changes updates the server-side record and recalculates the derived training volume field.

### Design/Evaluation Achievements
- **Evaluation Achievement 1**: 
    - Student Evaluation: Nguyen
    - Problems: The user liked the simplicity of the interface but wanted an easier way to log sets with different reps or weights without creating separate entries.
    - Comments: The user suggested adding support for both pounds and kilograms and showing an empty-state message when no workouts have been logged.
    - Changes: I would consider adding unit selection, support for different reps/weights across sets, and a clearer empty-state message.
