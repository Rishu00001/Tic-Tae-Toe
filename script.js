const gameCells = document.querySelectorAll(".cell");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const restartBtn = document.querySelector('.restartbtn')
const alertbox = document.querySelector('.alertbox')
let ting = new Audio('ting.mp3');
let winsound = new Audio('winner.mp3.mp3');
let tie = new Audio('tie.mp3');
//making variables
let currPlayer = "X";
let nextPlayer = "O";
let playerTurn = currPlayer;

player1.textContent = `Player 1: ${currPlayer}`
player2.textContent = `Player 2: ${nextPlayer}`

//Game starter function
const startGame = () => {
  gameCells.forEach((cell) => {
    cell.addEventListener("click",handleClick);
  });
};
//click event handler function
 const handleClick = (e)=>{
    if (e.target.textContent === "") {
        e.target.textContent = playerTurn;
        if (checkWin()) {
          winsound.play();
          showAlert(`${playerTurn} is the winner!`);
          disableCells()
        } else if (checkTie()) {
          tie.play();
          showAlert("It's a tie!");
          disableCells()
        } else {
          ting.play();
          changeTurn();
        }
      }
 }

//change player turn
const changeTurn = () => {
  if (playerTurn === currPlayer) {
    playerTurn = nextPlayer;
  } else {
    playerTurn = currPlayer;
  }
};
//A function to check win
const checkWin = () => {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningConditions.length; i++) {
    const [pos1, pos2, pos3] = winningConditions[i];
    if (
      gameCells[pos1].textContent != "" &&
      gameCells[pos1].textContent === gameCells[pos2].textContent &&
      gameCells[pos2].textContent === gameCells[pos3].textContent
    ) {
      return true;
    }
  }
  return false;
};
//A function to check tie
const checkTie = () => {
  let empty = 0;
  gameCells.forEach((cell) => {
    if (cell.textContent === "") {
      empty++;
    }
  });
  return empty === 0 && !checkWin();
};
//A function to disable cells
const disableCells = ()=>{
    gameCells.forEach(cells=>{
        cells.removeEventListener('click',handleClick)
        cells.classList.add('disabled')
    })
}
//Function to restart game
const restartGame = ()=>{
    gameCells.forEach(cell=>{
        cell.textContent = ''
        cell.classList.remove('disabled')
    })
    startGame();
}
const showAlert = (msg)=>{
  alertbox.style.display = "block"
  alertbox.textContent = msg
  setTimeout(()=>{
    alertbox.style.display = "none"
  },3000)
}
restartBtn.addEventListener('click',restartGame)
//calling startgame functiom
startGame();
