# Page Turner

Page Turner is a small two-tier reading list application. Add books with their author, page count, and planned minutes per day. The server keeps the list in memory and calculates estimated reading time for every book.

## How to Use

1. Run `npm install`.
2. Run `npm start`.
3. Open `http://localhost:3000`.
4. Add a book. Use Edit to change it or Delete to remove it.

Deployed application: https://a2-shortstack.onrender.com

## Technical Achievements

- Single-page app: The page fetches the current server-side dataset and updates the table after every add, edit, or delete without reloading.
- Modify existing data: Edit loads a book into the form; the server accepts a `PUT` request and updates the matching item.
- Server-derived field: Node.js calculates `readingTime` from `pages` and `minutesPerDay` before adding or updating a book. The formula is `ceil(pages / (minutesPerDay * 2))`.
- The server provides static files and JSON data. Each item contains title, author, pages, minutes per day, and reading time.

## Design/Evaluation Achievements

-Evaluator 1:
-2.
-3.
-4. 
-Evaluator 2:
-2.
-3.
-4. 

The interface uses CSS Grid for the form and Flexbox for action controls. External CSS includes element, class, and ID selectors and uses Georgia and Arial fonts.
