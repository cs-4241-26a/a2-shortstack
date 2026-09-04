Assignment 2 - Conspiracy Viability Calculator
===

Due: September 4th, by 1:59 PM.
https://a2-lexmoulton.onrender.com

Lex Moulton - WPI CS 4241 Assignment 2

A calculator for how long a conspiracy can stay secret, based on David Grimes' 2016 paper.
You enter a theory and how many conspiritors it has and how long its been running and it tells you the chance that it has been leaked and the time till it is guaranteed to have leaked.

The layout uses a flexbox for the body, the flex column centers the heading, list, button, and form. #entryForm is a nested flex column so the labels and inputs stretch to the full width of the
panel.

The color pallete is from adobe color.

## Instructions

Run `npm install` and then `npm start`, and open `http://localhost:3000`.
Press **New Conspiracy +** to open the entry form, fill in the fields then press **Add Conspiracy**. Press **Edit** to load that theory back into the form and change it, or the **X** to delete it.

## Technical Achievements

- **Single-page app that reflects server state**: `/api/add`, `/api/edit`, and `/api/delete` return 
  the full dataset which `render()` uses to redraw the list.
- **Modify existing data**: Each card has an **Edit** button that puts that row
  back into the form and posts to `/api/edit`, which rebuilds the row and recomputes the fields.
