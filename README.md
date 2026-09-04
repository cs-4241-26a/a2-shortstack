Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
---

## Task Deadline Tracker
A simple two-tiered task tracker. You type in a task name and pick a priority (high/medium/low), and the server automatically calculates a deadline for that task based on its priority and creation date (high = +1 day, medium = +3 days, low = +7 days). All tasks are shown in a table that you can add to or delete from, and the page updates instantly without ever reloading: when you submit the form, the server sends back the full updated dataset, and the page redoes the table from that response. 

CSS layout is done with **Flexbox**

- How to use: To run locally type `npm install` in the terminal, then `node server.js`, then open a web browser and visit `http://localhost:3000`

## Technical Achievements
- **Tech Achievement 1**: Adding or deleting a task never reloads the page. The client sends the new/deleted data to the server, the server recalculates the dataset (including the derived `deadline` field), and sends the whole updated list back as JSON. The client then redraws the table from that response using `fetch()` and `document.createElement`.

### Design/Evaluation Achievements
- **Design Achievement 1**: 
- **Last name of student**: Pal (my dad, not me)
- **Problem**: They mention that there isn't any sound for when buttons are pressed and there is no confirm button for deleting tasks
- **Surprising comments**: They say the website is too empty and want to have customizable options
- **Future Possible Changes**: Add sounds for buttons when clicked, a confirm check-off for wanting a confirm button for deleting tasks or not, and possible ways to customize the browser to the user's liking
