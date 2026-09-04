# Grade Calculator

Myer Cheng — CS4241 Assignment 2

A single-page app for entering one class name and numerical grade at a time. The Node.js server stores all records in
memory and calculates a letter grade for each record. The page shows the entire dataset in a table.

The app uses plain HTML, CSS, JavaScript, and Node.js's built-in HTTP and filesystem modules for routing, JSON request
parsing, and static-file serving. The external stylesheet uses flexbox to lay out and wrap the form, element/ID/class
selectors, and the web-safe Arial font.

Note: my submission is late because I needed to swap out my server version with the one I wrote without Express. There
was a question in the help channel about node_modules which led me to mistakenly believe that node modules were allowed.
I asked Charlie about this in class today and he said swapping out was fine and to leave a note about it in my README.

## How to use

1. Enter a class name and a numerical grade from 0 to 100. Decimal grades are allowed.
2. Click **Add class**, or press Enter in the form. The table updates without reloading the page.
3. Click **Edit** beside a class, change its name or grade, and click **Save**. **Cancel** leaves the saved record
   unchanged.
4. Click **Delete** beside a class to remove it.

| Numerical grade | Letter grade |
|-----------------|--------------|
| 90–100          | A            |
| 80 to below 90  | B            |
| 70 to below 80  | C            |
| Below 70        | NR           |

These are the calculator's chosen thresholds, based on WPI's grading policy.

The average above the table excludes NR records and counts every remaining record equally, including duplicate class
names. The browser calculates it from the server response on loading and after adding, editing, or deleting a class.
Only the displayed result is rounded to two decimal places. With no eligible records, it shows `—`. Failed requests
retain the last displayed average.

Records survive page refreshes but are cleared when the server restarts. The dataset is shared by all visitors to the
running server. Each page fetches data when it loads and after its own changes; it does not poll for other visitors'
changes.

Note: The data is reset whenever Render.com decides to reset it, since of course I am using the free tier.

## Technical achievements

- **Single-page application:** The form and results table are on the same page. Fetch requests add, update, and delete
  records. Each successful change returns the full server dataset, including calculated letter grades, and the client
  rebuilds the table from that response.
- **Modify existing data:** Each row has an Edit button that fills the form with the saved values. Saving sends a PUT
  request for that record's ID. The server validates the updated data and recalculates its letter grade before saving
  it. Reusing the form requires tracking whether the user is adding or editing and clearing that state after saving or
  cancelling.

The client does not calculate or assume a saved letter grade. Waiting for the server response keeps the displayed grades
consistent with the server's calculation. Failed saves leave the form and last displayed records intact and show an
error message.

## Design/Evaluation Achievements

- Tested my user interface with one person in my class:
  - Last name: Peterson
  - Task: Input your grades for this term by class
  - Problems with design: Lacking color/visual coherence
  - Surprising comments: They mentioned that the interface should be bigger, since it is confined to the top half of the
    page.
    - This was surprising to me since I personally thought it looked clean, and if it were used to calculate grades for
    - a whole semester or even a whole academic year, the space would be used efficiently.
  - Changes: Implement a color palette/theme, potentially add a scaling/zoom feature?
