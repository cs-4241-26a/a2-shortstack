// FRONT-END (CLIENT) JAVASCRIPT HERE

let ul = null;

// stores index of assignment being updated
let isEditing = null;

const submit = async function (event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();

    //gets current values of form
    const input = document.querySelector("#assignment"),
        category = document.querySelector("#category"),
        date = document.querySelector("#deadline"),
        json = { assignment: input.value, category: category.value, deadline: date.value },
        body = JSON.stringify(json);

    //uses POST to add a new assignment or PUT when an existing assignment is being edited
    let url = "/submit";
    let method = "POST";
    if (isEditing != null) {
        url = `/submit/${isEditing}`;
        method = "PUT";
    }
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body,
    });
    //clears form after submission
    input.value = "";
    category.value = "";
    date.value = "";

    //gets updated assignment list
    const arr = await response.json();
    isEditing = null;

    //clears list to prevent duplicates
    ul.innerHTML = "";
    console.log(arr);
    //displays all assignments returned by server and stores assignment information
    //to be retrieved when editing or deleting
    arr.forEach((item, i) => {
        const li = document.createElement("li");
        li.dataset.index = i;
        li.dataset.assignment = item.assignment;
        li.dataset.category = item.category;
        li.dataset.deadline = item.deadline;
        li.innerHTML = ` <input type="checkbox" /> <span>${item.assignment} | ${item.category} | ${item.deadline} | ${item.priority}</span><button class="edit">Edit</button><button class="delete">Delete</button>`;
        ul.appendChild(li);
    });
};

window.onload = function () {
    const button = document.querySelector("button");
    button.onclick = submit;
    //creates list to display elements
    ul = document.createElement("ul");
    ul.className = "list";
    document.body.appendChild(ul);

    ul.addEventListener("click", event => {
        if (event.target.classList.contains("delete")) {
            const li = event.target.parentElement;
            const index = li.dataset.index;
            ul.removeChild(li); // removes assignment
            const remainingItems = ul.querySelectorAll("li:not(.table-header)");

            //updates indexes of remaining assignments
            remainingItems.forEach((item, newIndex) => {
                item.dataset.index = newIndex;
            });
            fetch(`/submit/${index}`, {
                method: "DELETE",
            }).then(response => {
                if (response.ok) {
                    console.log("Deleted");
                }
            });
        }
        if (event.target.classList.contains("edit")) {
            const li = event.target.closest("li");
            isEditing = li.dataset.index;
            document.querySelector("#assignment").value = li.dataset.assignment;
            document.querySelector("#category").value = li.dataset.category;
            document.querySelector("#deadline").value = li.dataset.deadline;
            event.target.disabled = true; //prevents edit button to be clicked again
        }
    });
};
