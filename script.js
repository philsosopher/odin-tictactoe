/**
 * Game Rules
 * 0 -> O
 * 1 -> X
 * -1 -> empty
 */

const game = (function() {
    // initialize grid with -1
    const grid = Array(3).fill().map(() => Array(3).fill(-1));
    let gameOver = true;
    let currMove = 1; // current turn 1 or 0

    // Methods
    
    const printGrid = () => {
        grid.forEach(row => {
            console.log(row.join(" "));
            console.log('\n');
        });
    };

    const resetGrid = () => {
        grid.forEach(row => row.fill(-1));
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
            currMove = currMove === 0 ? 1 : 0;
            let charMove = currMove === 0 ? "O" : "X";
            turnIndicator.textContent = `Player ${charMove}'s turn`;
            res = evaluate();
        }

        printGrid();

        if (res === 0) {
            stopGame(0);
        } else if (res === 1) {
            stopGame(1);
        } else { // -2
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

    const startGame = (turnIndicator) => {
        gameOver = false;
        resetGrid;
        turnIndicator.textContent = "Player X's turn";
    };

    const stopGame = (player) => {
        gameOver = true;
        console.log(`${player} won!!`);
        // TODO: Remove event listeners for grid cells
    };
    
    // export/return object with public methods
    return {
        printGrid,
        resetGrid,
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
        grid.play(e.target, gridDom, turnIndicator);
    });
    game.startGame(turnIndicator);


}

main();