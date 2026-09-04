Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  

Ryan Ginn

Site: https://a2-rizerdev.onrender.com/

## Research Group To-do List
To-do list for my IQP research group. Helps the group with organization, and effeciency. Allowing users to add a task with an asignee option as well as a calender to set a tasks due date.

## Instructions: 
To use the application, enter a Task Name, Assignee, and Due Date into the form and click "Add Task". The server will calculate a derived field called "Days Remaining" by comparing the submitted due date to the current date. The updated dataset is then immediately displayed in the results table below.

## CSS Positioning Technique:
The primary visual elements are styled and positioned using CSS Flexbox. The `body` acts as a flex container (`flex-direction: column`, `align-items: center`) to vertically stack and center the main white content card and the background footer text. The form inputs inside the card are also aligned using Flexbox (`display: flex`, `gap: 10px`) for a clean, inline layout.

## Technical Achievements
- **(5 Points) Create a single-page app**: The application operates entirely on a single page. When a user submits new data, the JavaScript client intercepts the form submission, sends a POST request to the server, receives the updated dataset array in response, and dynamically rebuilds the DOM table—all without requiring a page reload.
## Design/Evaluation Achievements
- **Design Achievement 1**: 
