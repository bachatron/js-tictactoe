function Gameboard() {
    const board = [1,2,3,4,5,6,7,8,9]

    const getBoard = () => board;

    const dropToken = (position, token) => {
        const availableCells = board.filter((cell) => Number.isInteger(cell))

        if (!availableCells.includes(position + 1)) return;

        board[position] = token;
    }

    return {getBoard, dropToken};
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: 'X'
      },
      {
        name: playerTwoName,
        token: 'O'
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    let checkResult = null;

    const getCheckResult = () => checkResult;
  
    const playRound = (position) => {

        board.dropToken(position, getActivePlayer().token);
        
        const showBoard = board.getBoard();

        const winCombinations = [   [0,1,2],[3,4,5],[6,7,8],   //Rows
                                    [0,3,6],[1,4,7],[2,5,8],   //Columns
                                    [0,4,8],[2,4,6]       ];   //Diagonals
        
        for (let combo of winCombinations) {
          const [a, b, c] = combo;
          if (showBoard[a] === getActivePlayer().token &&
              showBoard[b] === getActivePlayer().token && 
              showBoard[c] === getActivePlayer().token) {
              checkResult = 'WIN';

          } else if (!showBoard.some(cell => Number.isInteger(cell))) {
              checkResult = 'TIE';
          }
        }

      if (checkResult === null) switchPlayerTurn(); //This is inside playround

    }
  
    return {
        getCheckResult,
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
  };

  function ScreenController(p1name, p2name) {
        const game = GameController(p1name, p2name);
        const playerTurnDiv = document.querySelector('.turn');
        const boardDiv = document.querySelector('.board');
    
        const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";
    
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
    
        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((cell, index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");

            cellButton.dataset.column = index;
            cellButton.textContent = cell;
            boardDiv.appendChild(cellButton);
        })
    }

    function clickHandlerBoard(e) {
      const selectedColumn = parseInt(e.target.dataset.column); // Convert string to number
  
      if (isNaN(selectedColumn)) return; // Check if it's a valid number

      const cellIndex = game.getBoard()[selectedColumn];

      // Check if the selected column is already occupied
      if (!Number.isInteger(cellIndex)) return; // If already occupied, do nothing

      game.playRound(selectedColumn);
      updateScreen();
  
      const result = game.getCheckResult();
      if (result === 'WIN') {
          announceWinner(game.getActivePlayer().name);
      } else if (result === 'TIE') {
          announceTie();
      }
    }
  
    function announceWinner(winnerName) {
        playerTurnDiv.textContent = `${winnerName} WON`;
        disableBoardClick(); // Disable further clicks on the board
    }
  
    function announceTie() {
        playerTurnDiv.textContent = 'TIE';
        disableBoardClick(); // Disable further clicks on the board
    }
    
    function disableBoardClick() {
        boardDiv.removeEventListener("click", clickHandlerBoard);
    }
    
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

const p1Name = document.getElementById('p1');
const p2Name = document.getElementById('p2');

console.log(p1Name.value, p2Name.value)

ScreenController(p1Name.value, p2Name.value)