const gameCells = document.querySelectorAll(".cell");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const restartBtn = document.querySelector(".restartbtn");
const alertbox = document.querySelector(".alertbox");
let ting = new Audio("ting.mp3");
let winsound = new Audio("winner.mp3.mp3");
let tie = new Audio("tie.mp3");

// Making variables
let currPlayer = "X"; // Human
let aiPlayer = "O";   // AI
let playerTurn = currPlayer; // Current turn

player1.textContent = `Player 1 (You): ${currPlayer}`;
player2.textContent = `AI Player: ${aiPlayer}`;

// Game starter function
const startGame = () => {
  gameCells.forEach((cell) => {
    cell.addEventListener("click", handleClick);
  });
};

// Click event handler function for Human
const handleClick = (e) => {
  if (e.target.textContent === "" && playerTurn === currPlayer) {
    e.target.textContent = playerTurn; // Human makes a move

    if (checkWin()) {
      winsound.play();
      showAlert(`${playerTurn} is the winner!`);
      disableCells();
    } else if (checkTie()) {
      tie.play();
      showAlert("It's a tie!");
      disableCells();
    } else {
      ting.play();
      changeTurn();

      // AI takes its turn after a short delay
      setTimeout(aiMove, 1500);
    }
  }
};

// AI Move Function
const aiMove = () => {
  const emptyCells = Array.from(gameCells).filter(cell => cell.textContent === "");

  // Step 1: Check for a winning move
  for (let cell of emptyCells) {
    cell.textContent = aiPlayer;
    if (checkWin()) {
      winsound.play();
      showAlert(`YOU LOSE THE GAME!!`);
      disableCells(); // AI wins, disable the game
      return;
    }
    cell.textContent = ""; // Undo the move
  }

  // Step 2: Block the opponent's winning move
  for (let cell of emptyCells) {
    cell.textContent = currPlayer;
    if (checkWin()) {
      cell.textContent = aiPlayer; // Block the player
      if (checkWin()) {
        winsound.play();
        showAlert(`YOU LOSE THE GAME!!`);
        disableCells(); // Block and win
        return;
      } else if (checkTie()) {
        tie.play();
        showAlert("It's a tie!");
        disableCells();
        return;
      }
      changeTurn();
      return;
    }
    cell.textContent = ""; // Undo the move
  }

  // Step 3: Pick a strategic position (center first, then corners)
  const centerCell = gameCells[4];
  if (centerCell.textContent === "") {
    centerCell.textContent = aiPlayer;
    if (checkWin()) {
      winsound.play();
      showAlert(`YOU LOSE THE GAME!!`);
      disableCells();
    } else if (checkTie()) {
      tie.play();
      showAlert("It's a tie!");
      disableCells();
    } else {
      changeTurn();
    }
    return;
  }

  const corners = [0, 2, 6, 8];
  for (let index of corners) {
    if (gameCells[index].textContent === "") {
      gameCells[index].textContent = aiPlayer;
      if (checkWin()) {
        winsound.play();
        showAlert(`YOU LOSE THE GAME!!`);
        disableCells();
      } else if (checkTie()) {
        tie.play();
        showAlert("It's a tie!");
        disableCells();
      } else {
        changeTurn();
      }
      return;
    }
  }

  // Step 4: Pick a random empty cell as a fallback
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  randomCell.textContent = aiPlayer;

  if (checkWin()) {
    winsound.play();
    showAlert(`YOU LOSE THE GAME!!`);
    disableCells();
  } else if (checkTie()) {
    tie.play();
    showAlert("It's a tie!");
    disableCells();
  } else {
    changeTurn(); // Switch back to human player
  }
};




// Change player turn
const changeTurn = () => {
  playerTurn = playerTurn === currPlayer ? aiPlayer : currPlayer;
};

// A function to check for a win
const checkWin = () => {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningConditions.length; i++) {
    const [pos1, pos2, pos3] = winningConditions[i];
    if (
      gameCells[pos1].textContent !== "" &&
      gameCells[pos1].textContent === gameCells[pos2].textContent &&
      gameCells[pos2].textContent === gameCells[pos3].textContent
    ) {
      return true;
    }
  }
  return false;
};

// A function to check for a tie
const checkTie = () => {
  let empty = 0;
  gameCells.forEach((cell) => {
    if (cell.textContent === "") {
      empty++;
    }
  });
  return empty === 0 && !checkWin();
};

// A function to disable cells
const disableCells = () => {
  gameCells.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
    cell.classList.add("disabled");
  });
};

// Function to restart the game
const restartGame = () => {
  gameCells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("disabled");
  });
  playerTurn = currPlayer; // Reset to human turn
  startGame(); // Restart the game
};

// Function to show alerts
const showAlert = (msg) => {
  alertbox.style.display = "block";
  alertbox.textContent = msg;
  setTimeout(() => {
    alertbox.style.display = "none";
  }, 3000);
};

// Restart button functionality
restartBtn.addEventListener("click", restartGame);

// Start the game
startGame();
