const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

// Grid & Game Settings
const gridSize = 20; // 20x20 pixel blocks
const tileCount = canvas.width / gridSize;

let snake = [];
let food = { x: 0, y: 0 };
let dx = gridSize; // Initial direction X (moving right)
let dy = 0;        // Initial direction Y
let score = 0;
let gameTimeout = null;
let changingDirection = false;

// Speed Control Variables
let gameSpeed = 250;      // Starting speed in milliseconds (higher = slower)
let minSpeed = 150;        // Speed cap so it doesn't become impossibly fast
let speedDecrease = 2;    // How many ms to speed up per food eaten

// Start Game
function startGame() {
    snake = [
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
    dx = gridSize;
    dy = 0;
    score = 0;
    gameSpeed = 150; // Reset speed back to starting speed
    scoreElement.innerText = score;
    spawnFood();
    
    if (gameTimeout) clearTimeout(gameTimeout);
    gameLoop(); // Start loop
}

// Main Game Loop
function gameLoop() {
    if (hasGameEnded()) {
        alert(`Game Over! Final Score: ${score}`);
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();

    // Loop again using the current gameSpeed (which gets faster)
    gameTimeout = setTimeout(gameLoop, gameSpeed);
}

// Clear Canvas
function clearCanvas() {
    ctx.fillStyle = "#16213e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw Snake
function drawSnake() {
    snake.forEach((part, index) => {
        // Head is bright green, body is slightly darker
        ctx.fillStyle = index === 0 ? "#4ecca3" : "#45b08c";
        ctx.strokeStyle = "#16213e";
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

// Move Snake & Speed Up on Food Catch
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;

        // Gradually increase speed safely
        if (gameSpeed > minSpeed) {
            gameSpeed -= speedDecrease;
        }

        spawnFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

// Generate Random Food Position
function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount) * gridSize;
    food.y = Math.floor(Math.random() * tileCount) * gridSize;

    // Prevent food from spawning on snake body
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            spawnFood();
        }
    });
}

// Draw Food
function drawFood() {
    ctx.fillStyle = "#e94560";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Collision & Game Over Check (Walls + Self-Collision)
function hasGameEnded() {
    // 1. Wall Collisions
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true;
    }

    // 2. Self Collision (Snake eats itself)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

// Handle Key Controls
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;
    if (changingDirection) return;

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if ((keyPressed === "ArrowLeft" || keyPressed === "a") && !goingRight) {
        dx = -gridSize;
        dy = 0;
        changingDirection = true;
    }
    if ((keyPressed === "ArrowUp" || keyPressed === "w") && !goingDown) {
        dx = 0;
        dy = -gridSize;
        changingDirection = true;
    }
    if ((keyPressed === "ArrowRight" || keyPressed === "d") && !goingLeft) {
        dx = gridSize;
        dy = 0;
        changingDirection = true;
    }
    if ((keyPressed === "ArrowDown" || keyPressed === "s") && !goingUp) {
        dx = 0;
        dy = gridSize;
        changingDirection = true;
    }
}

// Restart Button
restartBtn.addEventListener("click", startGame);

// Start game on load
startGame();