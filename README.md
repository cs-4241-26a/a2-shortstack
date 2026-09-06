Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
===
## Job Application Tracker

Link: https://a2-sahanagokulakrishnan.onrender.com/ 

Job Application Tracker is a single-page web application that lets user to enter and manage their job applications. Each application includes a company name, role, date applied, resume name, and current status.

Application stores dataset in Node.js server's memory. The interface uses CSS grid primarily to create a layout the application form. It also uses element, class, and ID selectors to style the form, results table, and all the other components of the application. 

Derived column: Application age; The Application age column is generated automatically by the server using the data applied field. Depending on the value, it displays "Today," "# days ago,", "# of months ago," "# of years ago."

## Technical Achievements
- **Single-page application**: Implemented a single-page interface that has both the entry and form and the results table. 

One of the main challenge I had was when initially I created duplicate table rows because the table body was not cleared before the new row was added to the dataset. A way that I was able to fix this was by using replaceChildren() before rebuilding the table. 

- **Modify Existing Data:** The application has the ability to modify an application's status using a dropdown and an update button in each row. 

One challenge the making the design experience better for the user. When the user changes the status and hits update, it seems like nothing has happened or that the user doesn't get any confirmation, even though the server does modify the status. One simple way to do this is using alert, though in the future, it can be improvised to make the user experience even better. 
### Design/Evaluation Achievements
- **Design Achievement 1**: Used CSS Grid to organize the application form and used element, class, and ID selectors throughout the stylesheet. I think the main challenge was understanding when which HTML elements needed classes vs. id and how they differed from one another. 
