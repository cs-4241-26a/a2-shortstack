Aidan Fisher
https://a2-bryacme.onrender.com/

This is an expense tracker app. You can add an expense (description, category, amount), see all of them in a table, edit any of them, or delete them. The server keeps track of everything and figures out a "spend level" for each expense automatically.

## Technical Achievements
- **Derived field from the server**: Every expense has a description, category, and amount. When you add or edit one, the server looks at the amount and adds a spendLevel field on its own (Low if under $10, Medium if $10-50, High if over $50).
- **Add/Edit/Delete all working through the server**: Added /add, /edit, and /delete routes on the server, plus a /expenses route that sends back the current data. The front end grabs that data and rebuilds the table every time something changes.
- **Edit feature (extra credit)**: Added an Edit button on each row that turns it into input boxes so you can change the values. Hitting Save sends it to the server and updates the table.

## Design Achievements
- **CSS selectors**: Used element selectors (table, th, td, body), an ID selector (#expense-form), and class selectors (.delete-btn, .edit-btn, .save-btn).
- **Flexbox**: Used flexbox on the form so the inputs and button line up in a row.
- **Font/style**: Used the Fredoka font from Google Fonts, went with a flat, colorful look with square corners instead of rounded ones.