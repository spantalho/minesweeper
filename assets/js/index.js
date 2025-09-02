const container = document.getElementById("game-container");
const menuContainer = document.querySelector(".game-menu");
const colorOverlay = document.querySelector(".color");

const rows = 10;
const cols = 10;
const bombCount = 14;

let gameOver = false;
let isMuted = false;

function createBoard() {
  const cells = [];

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    $(cell).addClass("cell");
    cell.dataset.id = i;
    container.appendChild(cell);
    cells.push(cell);
  }

  let bombsPlaced = 0;
  while (bombsPlaced < bombCount) {
    const randomIndex = Math.floor(Math.random() * cells.length);
    if (!cells[randomIndex].classList.contains("bomb")) {
      cells[randomIndex].classList.add("bomb");
      bombsPlaced++;
    }
  }

  return cells;
}

function handleCellClickEvent(event) {
  if (gameOver) return;

  const cell = event.target;
  if (cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");

  if (cell.classList.contains("bomb")) {
    $(cell).html("💣");
    revealAllBombs();
    colorOverlay.classList.remove("success");
    colorOverlay.classList.add("fail");
    // audio from Pixabay community
    playSound("assets/audio/minesweeper_failed.mp3");
    // alert("Game Over! 💥");
    gameOver = true;
  } else {
    const adjacentBombs = getAdjacentBombs(cell.dataset.id);
    $(cell).html(adjacentBombs || "");

    // audio from Pixabay community
    playSound("assets/audio/minesweeper_target.mp3");

    // success color flash
    colorOverlay.classList.remove("success");
    void colorOverlay.offsetWidth;
    colorOverlay.classList.add("success");
  }
}

colorOverlay.addEventListener("animationend", (e) => {
  if (e.animationName === "successFlash") {
    colorOverlay.classList.remove("success");
  }
});

function revealAllBombs() {
  const bombCells = cells.filter((cell) => cell.classList.contains("bomb"));
  bombCells.forEach((cell, index) => {
    setTimeout(() => {
      $(cell).addClass("revealed");
      $(cell).html("💣");
    }, index * 300);
  });
}

function getAdjacentBombs(index) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  let count = 0;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        const neighborIndex = r * cols + c;
        if (cells[neighborIndex].classList.contains("bomb")) {
          count++;
        }
      }
    }
  }

  return count;
}

function playSound(src) {
  if (isMuted) return;
  const audio = new Audio(src);
  audio.play();
}

$("#restart-game").on("click", function () {
  location.reload();
});

$("#mute-game").on("click", function () {
  isMuted = !isMuted;
  $(".volume-icon").toggle(!isMuted);
  $(".volume-off-icon").toggle(isMuted);
});

const cells = createBoard();
cells.forEach((cell) => cell.addEventListener("click", handleCellClickEvent));
