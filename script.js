/**
 * Game Rules
 * 0 -> O
 * 1 -> X
 * -1 -> empty
 */

const gameBoard = (function() {
    const grid = Array(3).fill().map(() => Array(3).fill(-1));

    const print = () => grid.forEach(row => console.log(row.join(" ")));
    const reset = () => grid.forEach(row => row.fill(-1));
    const getCell = (i, j) => grid[i][j];
    const setCell = (i, j, value) => {
        if (grid[i][j] === -1)
            grid[i][j] = value;
    };
    const isFull = () => grid.forEach(row => row.every((cell) => cell !== -1));

    return { print, reset, getCell, setCell, isFull };
})();

const displayController = (function() {

})();

const game = (function() {
    // initialize grid with -1
    
    let gameOver = true;
    let currMove = 1; // current turn 1 or 0

    // Methods
    
    const printGrid = () => {
        grid.forEach(row => {
            console.log(row.join(" "));
            console.log('\n');
        });
    };

    const resetGrid = (gridDom) => {
        grid.forEach(row => row.fill(-1));
        Array.from(gridDom.children).forEach(e => e.textContent = "");
    };

    const getIndex = (index) => {
        return { i: Math.floor((index) / 3), j: (index) % 3};
    }

    /**
     * 
     * @param {dom object} cell - the HTML DOM cell node
     * @returns evaluate() if valid move, -2 otherwise
     */
    const play = (cell, gridDom, turnIndicator) => {
        if (gameOver) {
            console.log("Please start a new game!");
            return;
        }

        const cellIndex = Array.from(gridDom.children).indexOf(cell);

        let {i, j} = getIndex(cellIndex);
        console.log(i,j);

        let res = -2; // invalid move

        if (grid[i][j] === -1) {
            grid[i][j] = currMove;
            let charMove = currMove === 0 ? "O" : "X";
            currMove = currMove === 0 ? 1 : 0;
            turnIndicator.textContent = `Player ${charMove}'s turn`;
            cell.textContent = charMove;
            res = evaluate();
        }

        printGrid();

        if (res === 0) {
            stopGame("O", turnIndicator);
        } else if (res === 1) {
            stopGame("X", turnIndicator);
        } else if (res === -2) {
            alert("Invalid Move");
        }
    };

    /**
     * 
     * @returns 1 (if 1 won), 0 (if 0 won), -1 otherwise
     */
    const evaluate = () => {
        for (let i = 0; i < 3; i++) {
            // check row i
            if (grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2] && grid[i][0] !== -1) {
                return grid[i][0];
            }

            // check column i
            if (grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i] && grid[0][i] !== -1) {
                return grid[0][i];
            }
        }

        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] && grid[0][0] !== -1) {
            return grid[0][0];
        }

        if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0] && grid[0][2] !== -1) {
            return grid[0][2];
        }

        return -1;
    };

    const startGame = (turnIndicator, gridDom) => {
        gameOver = false;
        resetGrid(gridDom);
        turnIndicator.textContent = "Player X's turn";
    };

    const stopGame = (player, turnIndicator) => {
        gameOver = true;
        turnIndicator.textContent = `Player ${player} won 🎉`;
    };
    
    // export/return object with public methods
    return {
        play,
        startGame
    };
    
})();


function main() {
    // dom elements
    const turnIndicator = document.querySelector("main .turn");
    const gridDom = document.querySelector("main .grid");
    const restartButton = document.querySelector("main .restart");

    gridDom.addEventListener("click", (e) => {
        // alert(e.target.textContent);
        game.play(e.target, gridDom, turnIndicator);
    });
    game.startGame(turnIndicator, gridDom);
    restartButton.addEventListener("click", () => {
        game.startGame(turnIndicator, gridDom);
    });


}

main();