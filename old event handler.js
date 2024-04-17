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
              boardDiv.removeEventListener("click", clickHandlerBoard);
              playerTurnDiv.textContent = `${game.getActivePlayer().name} WON`;
            } else if (result === 'TIE') {
              boardDiv.removeEventListener("click", clickHandlerBoard);
              playerTurnDiv.textContent = 'TIE';
            }
  }