Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
===
Nicholas Houghton
===
**Link: https://a2-nicholashoughton.onrender.com/**
## TV Show Tracker
This is a TV Show progress tracker. You can enter the name of any tv show you have or are currently watching, and then include the number of episodes you have seen, and then the total number of episodes in the show.  
After entering that, the derived field is the percent complete field, which shows you what percent through the show you are.

CSS Positioning: Flexbox to center the application.  
Other CSS includes using mulish from Google fonts, element selectors to add a border around the table, an id selector to add a margin for the table, and class selectors to center my form inputs. 

Instructions: Enter the name, episodes watched, and total episodes in the boxes, then press submit to add a show. To modify a show, select the number from the dropdown next to the modify button, that corresponds with the number row you want to modify, then fill in the form again and press modify, NOT submit



## Technical Achievements
- **Tech Achievement 1**: Single-page app. I made a single page app so when the page loads, it immediately makes a request to show all the results(some premade shows are in the server.js). When a user changes the data in any way by adding a show for example, it will update the page. This was challenging at first as I could not get the premade data to show right away. 
- **Tech Achievement 2**: Modify Data. You can modify data by selecting the number row that corresponds with the show you want to edit without deleting or submitting a new show. A challenging part was originally coming up how to edit a specific row without making it too complex, but the row selector was a good solution I think. 

### Design/Evaluation Achievements
- **Design Achievement 1**: Tested interface with 2 students in course:

My task for each person was to add two shows of their own, modify the episode watched count on one, and delete another. 

**Student 1**
1. Provide the last name of each student you conduct the evaluation with.  
   Ciarletta
2. What problems did the user have with your design?  
   They thought it would be a good idea if the submit button also acted as a modify button, and would change based on if you had "selected" a row. They mentioned it is a little confusing when going to modify something.
3. What comments did they make that surprised you?  
   Not exactly a comment, but I could tell they went to click submit instead of modify instinctively, when modifying content, and it surprised me, but I understand how it can be confusing as my other tester had the same issue. 
4. What would you change about the interface based on their feedback?  
   I would either add a paragraph explaining how to modify content, or implement the dual button functionality, but that could be confusing too. 

**Student 2**
1. Provide the last name of each student you conduct the evaluation with.  
   Balthazar
2. What problems did the user have with your design?  
   They also had a similar issue with modify, but actually clicked submit instead of the modify button. This is indicative to me that it is not fully intuitive right now.
3. What comments did they make that surprised you?  
   They mentioned they thought the colors for text and background chosen were not their favorite, although this is more personal preference, and I like the white blue combo.
4. What would you change about the interface based on their feedback?  
   After seeing another user have issues with the modify button, I would definitely at least put in an instruction blurb on the page for how to use it.
