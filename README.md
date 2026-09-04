# Richard Newman - Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js

Richard Newman
https://a2-richardnewman.onrender.com/

## Reaction Speed Test

I made a simple reaction speed test where, upon entering your name, you simply press the button to start and again as fast as possible once it becomes green; the page will record both your last time and average time across all reactions. Pressing the button in it's "Press" state will "submit" the time data, adding it to the server's memory that maintains the name, reaction time, and timestamp of the reaction; as well as calculating the average of all reaction times for that specific name, both of which are displayed to the user in columns. The added reaction time data can then be modified by clicking the pencil (✏️) icon, a single entry can be removed by clicking the garbage icon (🗑️), or all entries of a specific name can be removed by clicking on the garbage icon for the average reaction time for that person. Both the main button and the lists of times use flexboxes for positioning; the reaction button uses it to center itself, and the lists maximize the space between them on top of the second list being ordered as a reversed column to make the average reaction times of newer users appear first. The font is simply Helvetica with sans-serif as a fallback, but the header font also includes a text-shadow with a small offset and blur.

## Technical Achievements

- **Current State Always Shown**: All functionality is included on a single page, which always remains visible by updating with data from the server when the page loads and whenever a change in the data occurs.

- **Modify Existing Data**: Individual reaction time records can have their time fields edited by pressing the edit (✏️) button.

### Design/Evaluation Achievements

- **Think-aloud Protocol**:
    - Kyle Plosky
        - Prompt: Interact with the site (exlcluding the then-unimplemented edit and delete buttons)
        - Comments:
            - Initial confusion about the averages column; advice to add titles to each column for the data
            - Found a bug where the average showed full decimal points (it should have been the floor of the value)
            - Naturally found the fact that pressing the button early will return to the non-active state
            - Recommended a "leaderboard" type button where the reaction times and averages can be sorted by lowest
        - Overall, there were no particularly glaring issues, with the simple UI proving to be somewhat intuitive, and the comments were sparse but useful. I was surprised about the recommendation to label the columns, since it was quite an obvious one but something that hadn't even come to mind as I was developing the webpage.
    - James Ostermiller
        - Prompt: "Go ham"
        - Comments:
            - You have to explicitly click out of form in order for the start button to show, rather than when you start typing
            - The sample times are an order of magnitude too small
            - He observed that you return to the "start" button if you click on the button when it says wait or if you wait too long to press it
            - Editing the times "feels like cheating" and also can go negative
        - The delete and edit buttons worked properly, and the site overall again was thankfully intuitive. I changed the sample times to be more reasonable (before they averaged 55ms; the typical mousepad reaction time hovers around 300ms)
