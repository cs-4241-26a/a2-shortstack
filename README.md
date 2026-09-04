## Griffin's To-Do List

A very simple to-do list web app that allows tasks to be created and moved between three lists: An open list for new tasks, an in progress task list that only allows a max of three items, and a done list for finished tasks. You add a new task with a name and priority, and the server will compute a dervied deadline based on the input priority. Buttons on the tasks allows you to move it between lists, edit the task's text, and delete it.

For CSS positioning, I used flexbox to position the lists.

Live site: [https://a2-griffinmunhall.onrender.com/](https://a2-griffinmunhall.onrender.com/)

## Technical Achievements

- Single-page app: The app is on one page and shows the form plus all three lists at the same time. When the user submits the form or selects a button, a fetch request is sent to the server, and the server updates the in-memory dataset and responds with the full updated data, and the client redraws all lists from that, meaning there is no reload.

- Modifying Data: Paired with adding and deleting tasks, each task has an edit button. Selecting this opens a text prompt that is filled with the current text, and the new text is sent to an edit route within the server, which finds the task by ID, updates, and send back the new dataset so the page refreshes.

### Design/Evaluation Achievements

- Student Evaluation: Musawwir
    - Problems: Buttons to move items make the design clunky, a click and drag approach would be optimal UX-wise
    - Comments: Nothing particularly suprising but he liked what I did with color-scheme and overall layout
    - Changes: I would remove the buttons that allow you to move items between columns and just switch to a click and drag approach. I might also change how delete items, instead leaving it as an option that appears after right-clicking for a cleaner UI.