Repository:
https://github.com/apetersongit/a2-apetersongit

## Your Web Application - Watchlist Maker
My web application is a "Watchlist Maker". It allows the user to input the name of a film or show, input if that title is a film or a show, and input what streaming service that title is on from a list. Then that title can be submitted to an array that includes the title, film or show, streaming service, and date it was added. From that list you can edit the details of a title or delete it from the list. The CSS positioning technique I used was flexbox, which I used in main and in watchlist-form. 

## Technical Achievements

- **Tech Achievement 1**: "(5 points) Create a single-page app that both provides a form for users to submit data and always shows the current state of the server-side data."

For this I implemented a single page watchlist by using fetch() to send new entries to the server without having to reload the page. While the user adds the title, type, and streaming service, the server adds the dateAdded field, updates the server side data, and sends the updated dataset back and the watchlist table is updated with the new data. This was challenging because I had to make sure data was sent to the server, updated, sent back, and displayed without having to reload which was an issue I found when first implementing it where it only updated when reloading.

- **Tech Achievement 2**: "(5 points) In addition to a form enabling adding and deleting data on the server, also add the ability to modify existing data."

For each title in the watchlist table there is a delete button. Next to this button I added an Edit button which, when clicked, the existing data is placed back into the above form where data is first put in so the user can modify it. When submitted again, the new data is sent to the server through an /edit POST request (similar to /submit and /delete) and the server updates the correct entry in the list. This was challenging because I had to track which specific item was being modified and make sure its data is preserved, since I ran into some issues when editing or deleting where it would edit/delete the wrong title in the list.

### Design/Evaluation Achievements

- **Design Achievement 1**: "(5 points) Test your user interface with other students in the class..."

1. Cheng, Myer
2. He had no issues, just criticisms like to make the UI less wide/more centered in the screen and to add a confirmation button when you delete a title.
3. I think the comment that surprised me the most was to make the webpage less wide since the actual width of the page was not something I really thought about when designing the CSS.
4. I would add a confirmation button after the user presses delete. I would also change the width of the "Add to Watchlist" and "Results" so they're less wide and easier to read since the text wouldn't be at the edges of the screen.