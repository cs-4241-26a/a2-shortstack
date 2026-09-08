## Task Deadline Tracker
A two-tier web app for tracking tasks. You add a task with a priority level and a creation date, and the **server** automatically computes a derived `deadline` field based on how urgent the priority is (high = +1 day, medium = +3 days, low = +7 days). The page is a single-page app: the results table always reflects the current state of the server's in-memory dataset, and you can add, edit, and delete tasks without a page reload.

CSS positioning: the overall page uses **Flexbox** (`.layout` and `#task-form`) to arrange the entry form and results table responsively.

**To use the application**: open the site, fill in a task name, choose a priority, pick a creation date, and click "Add Task." The table below updates immediately with the task and its computed deadline. Click "Edit" on any row to load it back into the form for editing, or "Delete" to remove it.

Live site: https://a2-hungdao.onrender.com/

## Technical Achievements
- **Tech Achievement 1 (Single-page app, 5 pts)**: The form and results table live on one page (`index.html`). Adding a task sends a `POST` to `/data`; the server computes the derived `deadline` field and responds with the full, updated dataset as JSON, which the client uses to re-render the table in place — no page reload or second page needed.

- **Tech Achievement 2 (Modify existing data, 5 pts)**: Clicking "Edit" on a row repopulates the form with that task's current values and switches the form into edit mode. Submitting sends a `PUT` request with the task's `id`, and the server updates that row (recomputing the deadline from the possibly changed priority/created date) before returning the refreshed dataset.

### Design/Evaluation Achievements
Not attempted for this submission.

Note: I have asked permission from the professor to complete this assignment late