const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const levelText = document.getElementById('level'); 

const gridSize = 18;
let croco = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;
let level = 1; 

function draw() {
  board.innerHTML = '';
  drawCroco();
  drawFood();
  updateScore();
  updateLevel(); 
}

function drawCroco() {
  croco.forEach((segment, index) => {
    let className = 'croco-segment';
    if (index === 0) {
      className = 'croco';
    } else if (index === croco.length - 1) {
      className = 'croco-tail';
    } else {
      className = 'croco-middle';
    }

    const crocoElement = createGameElement('div', className);
    setPosition(crocoElement, segment);

    if (index === 0) {
      crocoElement.style.transform = getTransformForDirection();
    } else if (index === croco.length - 1) {
      crocoElement.style.transform = getTransformForDirection(croco[index - 1], segment);
    } else {
      crocoElement.style.transform = getTransformForDirection(croco[index - 1], segment);
    }

    board.appendChild(crocoElement);
  });
}

function getTransformForDirection(previousSegment, currentSegment) {
  if (!previousSegment) {
    return ''; 
  }

  if (previousSegment.x < currentSegment.x) {
    return 'rotateY(0deg)';
  } else if (previousSegment.x > currentSegment.x) {
    return 'rotateY(180deg)';
  } else if (previousSegment.y < currentSegment.y) {
    return 'rotate(90deg)';
  } else if (previousSegment.y > currentSegment.y) {
    return 'rotate(270deg)';
  } else {
    return ''; 
  }
}

function getTransformForDirection() {
  switch (direction) {
    case 'up':
      return 'rotate(270deg)';
    case 'down':
      return 'rotate(90deg)';
    case 'left':
      return 'rotateY(180deg)';
    case 'right':
      return 'rotateY(0deg)';
  }
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('img', 'food');
    foodElement.src = 'bird.png'; 
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function move() {
  const head = { ...croco[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  croco.unshift(head);  

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
  } else {
    croco.pop();
  }

  checkCollision();
  draw();
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(move, gameSpeedDelay);
}

function handleKeyPress(event) {
  if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  } 
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 8;
  }
}

function checkCollision() {
  const head = croco[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < croco.length; i++) {
    if (head.x === croco[i].x && head.y === croco[i].y) {
      resetGame();
      break;
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  croco = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  level = 1; 
  updateScore();
  updateLevel(); 
}

function updateScore() {
  const currentScore = croco.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
  updateLevel(); 
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = croco.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

function updateLevel() {
  const currentScore = croco.length - 1;
  const newLevel = Math.floor(currentScore / 5) + 1;
  if (newLevel > level) {
    level = newLevel;
    gameSpeedDelay = Math.max(gameSpeedDelay - 10, 25); 
    clearInterval(gameInterval);
    gameInterval = setInterval(move, gameSpeedDelay); 
  }
  levelText.textContent = level.toString().padStart(1, '0');
}
