# Movie Watchlist

This project is my second assignment for CS4241. It introduces a basic two-tier web application using HTML, CSS, JavaScript, and Node.js. The application allows users to create and manage a movie watchlist.

Live Website: https://a2-jenniferyuan.onrender.com/

Users can add a movie by entering the movie title, genre, and rating. The server automatically creates a recommendation based on the rating.

## Technical Achievements

I created a single-page Movie Watchlist application that communicates with a Node.js server using JavaScript and fetch.

- I created a form that allows users to add movies by entering the movie title, genre, and rating.
- I created a results table that displays all of the movies currently stored on the server.
- I added a Delete button that allows users to remove movies from the watchlist.
- I added an Edit feature that allows users to modify movies already stored on the server.
- I used fetch() to send and receive data between the client and Node.js server without reloading the webpage.
- I created a derived field called `recommendation`. The server calculates the recommendation based on the user's rating:
  - Ratings 8–10 = Must Watch
  - Ratings 6–7 = Worth Watching
  - Ratings 1–5 = Skip
- When a movie is edited, the server recalculates the recommendation based on the new rating.
- I used Flexbox to organize the layout of the application.

### Technical Achievement 1: Single-Page Application

I created a single-page application where users can add and delete movies while always seeing the current server-side dataset. When a movie is added or deleted, the server sends the updated dataset back to the browser and JavaScript updates the table without refreshing the page.

### Technical Achievement 2: Modify Existing Data

I added an Edit feature that allows users to modify an existing movie's title, genre, and rating. After the movie is edited, the server also recalculates the recommendation field.

## Design Achievements

I styled the Movie Watchlist using an external CSS stylesheet.

- I used Flexbox to organize the form and main sections of the website.
- I used element selectors such as body, button, table, th, and td to apply general styles to HTML elements.
- I used class selectors such as .card, .field, .recommendation, and .small-button to style reusable groups of elements.
- I used ID selectors such as #form-section, #results-section, #message, and #movie-count to style unique sections of the page.
- I styled the form, buttons, movie table, recommendation labels, and page sections.
- I used different visual styles for Must Watch, Worth Watching, and Skip recommendations.
- I used different colors throughout the website to have better aesthetic.
- I used custom fonts, such as Black Ops One and Cinzel, to give the Movie Watchlist its own visual style.
- I made the layout responsive for smaller screens.

## Think-Aloud Protocol 1
Task: Explore the website and try adding/editing your movie recommendation list:
- Last name of student: Ye (not from our class)
- The user found that the list becomes overwhelming and difficult to use when the list grows bigger. They suggest to add an option that could allow users to adjust their list by movie category or by alphabet order.
- What surprised me was that the user though the color scheme of the website was too bright for a website used to record movies a person has watched.

## Think-Aloud Protocol 2
Task: Explore the website and try adding/editing your movie recommendation list:
- Last name of student: Brooke (not from our class)
- The user found it annoying that she couldn't add more than one genre for a movie as many movies often have more than one genre associated with the story. For the future, I would consider adding a feature that allows users to add more than one genre.
- The student didn't really say anything that surprised me.



AI Use: I used ChatGPT to help explain errors, debug my Node.js server, and help with HTML, CSS, and JavaScript implementation.