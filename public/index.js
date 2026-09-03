const gameBoard = document.querySelector("#game-board");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score-text");
const resetButton = document.querySelector("#reset-button");
const gameStatus = document.querySelector("#game-status");

const scoreForm = document.querySelector("#score-form");
const leaderboard = document.querySelector("#leaderboard");
const resultsBody = document.querySelector("#results-body");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "lightgreen";
const snakeColor = "purple";
const foodColor = "red";
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);
scoreForm.addEventListener("submit", submitScore);

loadData();
gameStart();

async function loadData() {
    try {
        const response = await fetch("/api/data");
        const data = await response.json();
        renderResults(data);
    } catch (error) {
        console.error(error);
    }
}

async function sendEntry(entry) {
    const response = await fetch("/api/data", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(entry)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Could not save entry.");
    }

    renderResults(data);
}

async function submitScore(event) {
    event.preventDefault();

    try {
        await sendEntry({
            name: document.querySelector("#game-name").value,
            score: Number(document.querySelector("#score-input").value),
            comment: document.querySelector("#score-comment").value
        });

        scoreForm.reset();
        document.querySelector("#score-input").value = score;
        alert("Your score was added to the leaderboard!");
    } catch (error) {
        alert(error.message);
    }
}

function renderResults(data) {
    // Leaderboard: only entries with scores greater than zero, sorted highest first.
    leaderboard.innerHTML = "";

    const scoredEntries = data
        .map((item, index) => ({...item, index}))
        .filter(item => Number(item.score) > 0)
        .sort((a, b) => Number(b.score) - Number(a.score));

    scoredEntries.slice(0, 10).forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${escapeHTML(item.name)}</strong> — ${item.score} points`;
        leaderboard.appendChild(li);
    });

    if (scoredEntries.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No scores yet. Be the first!";
        leaderboard.appendChild(li);
    }

    // Complete server-side dataset.
    resultsBody.innerHTML = "";

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(item.name)}</td>
            <td>${item.score}</td>
            <td>${escapeHTML(item.comment || "")}</td>
            <td>${new Date(item.submittedAt).toLocaleString()}</td>
            <td>${escapeHTML(item.scoreLevel)}</td>
            <td class="actions">
                <button type="button" class="edit-button" data-index="${index}">Edit</button>
                <button type="button" class="delete-button" data-index="${index}">Delete</button>
            </td>
        `;

        resultsBody.appendChild(row);
    });

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", () => deleteEntry(Number(button.dataset.index)));
    });

    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", () => editEntry(Number(button.dataset.index), data[Number(button.dataset.index)]));
    });
}

async function deleteEntry(index) {
    if (!confirm("Delete this entry?")) return;

    const response = await fetch("/api/data", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({index})
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.error || "Could not delete entry.");
        return;
    }

    renderResults(data);
}

async function editEntry(index, item) {
    const name = prompt("Name:", item.name);
    if (name === null) return;

    const scoreValue = prompt("Score:", item.score);
    if (scoreValue === null) return;

    const comment = prompt("Comment:", item.comment || "");
    if (comment === null) return;

    const response = await fetch("/api/data", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            index,
            name,
            score: Number(scoreValue),
            comment,
            submittedAt: item.submittedAt
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.error || "Could not update entry.");
        return;
    }

    renderResults(data);
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ---------------- Snake game ----------------

function gameStart() {
    running = true;
    score = 0;
    scoreText.textContent = score;
    gameStatus.textContent = "Use the arrow keys to move.";
    createFood();
    clearBoard();
    drawFood();
    drawSnake();
    nextTick();
}

function nextTick() {
    if (!running) {
        displayGameOver();
        return;
    }

    setTimeout(() => {
        clearBoard();
        drawFood();
        moveSnake();
        drawSnake();
        checkGameOver();
        nextTick();
    }, 75);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }

    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;

    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    switch (true) {
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
    ) {
        running = false;
        return;
    }

    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
            return;
        }
    }
}

function displayGameOver() {
    ctx.font = "75px 'Caudex', serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame() {
    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];

    gameStart();
}
