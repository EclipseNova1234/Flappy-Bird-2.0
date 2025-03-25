const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth; // Adjust for mobile
canvas.height = window.innerHeight > 500 ? 500 : window.innerHeight * 0.8;

const birdImg = new Image();
birdImg.src = "bird.png"; 

const bgImg = new Image();
bgImg.src = "night-city.png"; 

let bird = { x: 150, y: canvas.height / 2, width: 40, height: 28, velocity: 0, gravity: 0.5 };
let pipes = [];
let gameOver = false;
let score = 0;
let pipeSpeed = 2.5;

// 💥 Mobile Tap Controls
canvas.addEventListener("touchstart", () => {
    if (!gameOver) bird.velocity = -8;
});

// 🖥️ Keyboard Controls (For PC)
document.addEventListener("keydown", () => {
    if (!gameOver) bird.velocity = -8;
});

// Pipe Generator
function createPipe() {
    let gap = 150;
    let topHeight = Math.random() * (canvas.height / 2) + 70;
    let bottomHeight = canvas.height - topHeight - gap;

    pipes.push({ x: canvas.width, topHeight, bottomHeight, counted: false });
}

// Game Loop
function update() {
    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) endGame();

        for (let pipe of pipes) {
            pipe.x -= pipeSpeed;

            if (!pipe.counted && pipe.x + 50 < bird.x) {
                score++;
                pipe.counted = true;
                scoreDisplay.innerText = "Score: " + score;

                if (score % 5 === 0) pipeSpeed += 0.5;
            }

            if (bird.x < pipe.x + 50 && bird.x + bird.width > pipe.x &&
                (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)) {
                endGame();
            }
        }

        if (pipes.length > 0 && pipes[0].x < -50) pipes.shift();
    }
}

// 🎨 Draw Game Elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); // 🌃 Night City

    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    for (let pipe of pipes) {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, 50, pipe.bottomHeight);
    }
}

// Game Over & Restart with Countdown
function endGame() {
    gameOver = true;
    document.getElementById("countdown").style.display = "block";
    let count = 3;

    function countdown() {
        document.getElementById("countdown").innerText = count;
        if (count > 0) {
            count--;
            setTimeout(countdown, 1000);
        } else {
            restartGame();
        }
    }

    countdown();
}

// Restart Game
function restartGame() {
    document.getElementById("countdown").style.display = "none";
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    gameOver = false;
    score = 0;
    pipeSpeed = 2.5;
    scoreDisplay.innerText = "Score: " + score;
}

// Main Game Loop
setInterval(() => {
    update();
    draw();
}, 20);

// Pipe Generator Interval
setInterval(createPipe, 2000);
