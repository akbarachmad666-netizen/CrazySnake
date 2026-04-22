const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, level, game, speed;
let obstacles = [];

// START
function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = spawnFood();
  score = 0;
  level = 1;
  obstacles = generateMap(level);

  speed = parseInt(document.getElementById("difficulty").value);

  clearInterval(game);
  game = setInterval(draw, speed);

  document.addEventListener("keydown", changeDirection);
}

// FOOD
function spawnFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// MAP GENERATOR
function generateMap(level) {
  let obs = [];

  if (level === 2) {
    for (let i = 0; i < 20; i++) obs.push({ x: 200, y: i * box });
  }

  if (level === 3) {
    for (let i = 5; i < 15; i++) obs.push({ x: i * box, y: 200 });
  }

  if (level >= 4) {
    for (let i = 0; i < 10; i++) {
      obs.push({ x: i * box, y: 100 });
      obs.push({ x: 300, y: i * box });
    }
  }

  return obs;
}

// DRAW
function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  // OBSTACLES
  ctx.fillStyle = "gray";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, box, box));

  // SNAKE
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(seg.x, seg.y, box, box);

    // HEAD FACE 😎
    if (i === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(seg.x + 5, seg.y + 5, 3, 3);
      ctx.fillRect(seg.x + 12, seg.y + 5, 3, 3);
    }
  });

  // FOOD
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // EAT
  if (headX === food.x && headY === food.y) {
    score++;
    food = spawnFood();

    if (score % 10 === 0 && level < 10) {
      level++;
      obstacles = generateMap(level);

      // speed naik dikit aja (ga brutal)
      speed -= 5;
      clearInterval(game);
      game = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // COLLISION
  if (
    headX < 0 || headY < 0 ||
    headX >= 400 || headY >= 400 ||
    collision(newHead, snake) ||
    collision(newHead, obstacles)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
  }

  snake.unshift(newHead);

  document.getElementById("info").innerText =
    "Level: " + level + " | Score: " + score;
}

// COLLISION
function collision(head, arr) {
  return arr.some(o => o.x === head.x && o.y === head.y);
}

// CONTROL
function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}
