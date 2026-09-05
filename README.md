Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
===

## ATAssist - https://a2-noahfreeman.onrender.com/
ATAssist is a tool to help log your time on the clock. Sick of Automated Time & Attendance (ATA) being confusing? Use this thing.
In order to use the app, you must login with a username in the upper left box, you can use a new name or an existing one. Then input the date and time and click the 'clock in' or 'clock out' buttons to log the time event.
When logged in, user statistics will display in the upper right, and all time entries for your user will appear at the bottom of the screen.
When no user is logged in, the app will display statistics for all users, and the table will show all time entries in the server.
When a user is logged in, you can edit that user's time entries my clicking the corresponding edit button in the table, editing the values, and clicking confirm.

- Derived field: The string 'day' field is calculated based on the inputted numerical date
- HTML forms: 2 forms, ids loginForm & timeForm
- CSS selectors: Element, Id, and class selectors are present
- CSS positioning: Flexbox positioning is used in the timeForm (index.html 63 & main.css 119)

## Technical Achievements
- **Single Page App**: The app functions with only one page, the table updates as the user submits forms.
- **Modify Data**: The user is able to edit an entry by logging it, clicking the edit button on a table row, changing the values, and clicking confirm.
