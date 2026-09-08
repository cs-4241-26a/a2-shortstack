Frank Santen
<RENDER LINK>

### Illustrious Calculator ###
For this project, we were instructed to make a webpage that interacts with data from the server. 
With these requirements, I decided to make a silly calculator that can only multiply two positive 
numbers. When 2 numbers are provided, the client sends a request to the server, which then responds 
with the answer (alongside all previous answers, to show calculator history.) I also gave the 
calculator feelings, as well as insecurity surrounding its inability to deal with negative numbers. 
The calculator is often off by +/- 1, so the user is allowed to edit the calculator's result to 
better match reality (which makes the calculator anxious about its performance). The user can also 
delete history, which the calculator has no strong opinions on. 


### Technical Achievements ###
1. "Create a single-page app that both provides a form for users to submit data and always shows 
the current state of the server-side data. To put it another way, when the user submits data, the 
server should respond sending back the updated data (including the derived field calculated on the 
server) and the client should then update its data display."

I achieved this goal by placing a form at the bottom with an input for each number. When the 
"query" button is pressed, it sends a POST request to the server with the two numbers. The server 
stores the numbers as well as calculates their multiplication. After every POST request, the server 
sends back the total list of the calculator's history. This is then embedded into the HTML by the 
client, all on the same page. 

2. "In addition to a form enabling adding and deleting data on the server, also add the ability 
to modify existing data."

I achieved this goal by adding buttons below each equation. These buttons were assigned to functions 
that would POST a deletion / edit request to the server in a similar manner to the query button. 
When the server recieved these post requests, it would remove/edit equations in memory based on the 
ID that the post request provided. IDs for each equation count up from 1, ensuring there will be no 
duplicate IDs (until the integer limit is reached, which would be quite unreasonable). 


### Design/Evaluation Achievements ###
1. Test your user interface with other students in the class. Define a specific task for them to 
complete (ideally something short that takes <10 minutes), and then use the think-aloud protocol 
to obtain feedback on your design. 

I conducted this test with my roommate Anthony Volpe. I instructed him to explore the site for 2 
minutes, then instructed him to try and make the calculator sad. He had a bit of a hard time reading 
the text on the "QUERY THE ILLUSTRIOUS CALCULATOR" button due to the odd font. Additionally, he had 
a slight problem making the calculator sad, as he had submitted many valid, positive numbers while 
messing around before submitting negative ones in an attempt to make the calculator sad. This meant 
the calculator was not very saddened overall, but he couldn't tell because of the repetitive dialogue. 
I was surprised that he was confused by the "edit entry" button clearing the entry's result when it 
was pressed with no input inside the "new result" box. To better improve the interface, I would try to 
make the "edit entry" button unusuable when the "new result" input is empty. Additionally, I would put a 
cap on how happy the calculator can become so that it is more responsively saddened when the user tries. 