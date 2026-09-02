# Phone Inventory Tracker

# Render Website: https://a2-davidpeterson.onrender.com/

This application tracks phone inventory. Users can manage phone models, release years, storage capacities, and prices. The server calculates the age of the phone based on the current year (2026). The layout is built using CSS Flexbox for structured and responsive positioning.

# Technical Achievements

## Single-Page Application:

The client uses JavaScript and the Fetch API to submit form data. The server processes the data, calculates the derived "Age" field, and returns the updated dataset. The client dynamically rebuilds the HTML table without reloading the page.

## Modify Existing Data:

The application supports full data modification. Users can click the Edit button to populate the form with a specific item's data, change the values, and submit the form to update the existing server-side record.

# Design Achievements

## User Study

### Instructions Given

1. Enter the phone details (Model, Phone Age, Price) in the form.
2. Click Submit to add a new phone to the database.
3. Use the Edit button on an existing row to load its data back into the form.
4. Update the fields and click Update.
5. Use the Delete button to remove an entry from the table.
6. Click Clear to empty the input fields at any time.

### Person 1:

**Provide the last name of each student you conduct the evaluation with.**

Ho

**What problems did the user have with your design?**

1. When entering the "Storage" field, she initially thought it was talking about how many of this phone there were in storage. She suggested to add a clarifier (Giga Bytes) so it is more clear.
2. She tried to enter a price 2,000. However, my program could not handle commas in numbers so it would not work. This was a very good catch.

**What comments did they make that surprised you?**

She mentioned how it would be nice to have a date selector for the year. I feel like entering four numbers is faster though...

**What would you change about the interface based on their feedback?**
Based on the feedback I should change Storage to instead say like Phone Storage Capacity (GB) or something to that effect to make it more clear. Otherwise, she was able to find all the buttons etc so I think the design as a whole was solid!
