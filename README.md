# Task Tracker

[Live app on Render](https://a2-christiandellanno.onrender.com/) &middot;

A single-page task tracker. Add a task and pick a priority (low / medium / high); the server automatically computes a **deadline** by adding an offset (7 / 3 / 1 days) to the task's creation date. Tasks can be edited or deleted, and the table on the page updates instantly from the server's response &mdash; no page reloads.

CSS positioning technique used: **Flexbox**, for the overall page layout (`#app`, `#task-form`) and the responsive two-panel arrangement of the form and results table.

To run locally:

```
npm install
npm start
```

Then visit `http://localhost:3000`.

## Technical Achievements

- **Tech Achievement 1 (Single-page app, 5 pts)**: The form and results table live on one page (`index.html`). When a task is added, edited, or deleted, the client sends a `fetch` request to the server; the server recomputes the dataset (including the derived `deadline` field) and sends back the **entire updated array** in its response. The client re-renders the table from that response with no page reload. This was implemented with a single `render()` function in `main.js` driven entirely by the server's returned JSON, so the client never has to guess or duplicate server-side logic (like the deadline calculation) &mdash; it just displays what the server computed.
- **Tech Achievement 2 (Edit existing data, 5 pts)**: Beyond adding/deleting, users can click "Edit" on any row to turn it into inline `<input>`/`<select>` fields, then "Save" to `PUT /tasks/:id`. The server re-derives the `deadline` if the priority changed, while preserving the original `created` timestamp so edits don't reset the countdown. This required tracking editing state (`editingId`) client-side and re-rendering a single row differently from the rest without disturbing the others' event handlers, which I handled with event delegation on the table body instead of attaching listeners per-row.

### Design/Evaluation Achievements

- **Design Achievement 1**: I conducted a think-aloud session with Michael Tian. I asked them to add a task, then delete it.
  1. What problems did the user have with your design? They felt the color scheme could be improved.
  2. What comments did they make that surprised you? They liked the overall design but flagged the colors specifically as an area to revisit.
  3. What would you change about the interface based on their feedback? I'd experiment with a different color palette (e.g. adjusting the priority pill colors and accent color for better contrast/appeal).
- **Design Achievement 2**: I conducted a second think-aloud session with Andrew Bugbee. I asked them to add a task, then delete it.
  1. What problems did the user have with your design? None with actually completing the task, but they noted the app doesn't tell you when a task's deadline is approaching or has passed.
  2. What comments did they make that surprised you? They found the interface easy to use, but wished for a notification when tasks need to be done.
  3. What would you change about the interface based on their feedback? I'd add a visual indicator (e.g. highlighting or an icon) on rows whose deadline is near or has passed.
