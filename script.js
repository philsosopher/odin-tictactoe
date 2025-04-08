/**
 * Game Rules
 * 0 -> O
 * 1 -> X
 * -1 -> empty
 */

function Player(name, marker) {
    let score = 0;
    return { name, marker, score };
}

const Gameboard = (function() {
    const grid = Array(3).fill().map(() => Array(3).fill(-1));

    const print = () => grid.forEach(row => console.log(row.join(" ")));
    const reset = () => grid.forEach(row => row.fill(-1));
    const getCell = (i, j) => grid[i][j];
    const setCell = (i, j, value) => {
        if (grid[i][j] === -1)
            grid[i][j] = value;
    };
    const isFull = () => grid.every(row => row.every((cell) => cell !== -1));
    const getIndex = (index) => ({i: Math.floor(index / 3), j: index % 3});
    return { print, reset, getCell, setCell, isFull, getIndex };
})();

const DisplayController = (function() {
    const gridDom = document.querySelector(".grid");
    const p1score = document.querySelector(".player1 .score");
    const p2score = document.querySelector(".player2 .score");
    const p1name = document.querySelector(".player1 .name");
    const p2name = document.querySelector(".player2 .name");
    const turnIndicator = document.querySelector("main .turn");
    
    // render grid dom based on gameboard
    const renderBoard = () => {
        Array.from(gridDom.children).forEach((cell, index) => {
            const {i, j} = Gameboard.getIndex(index);
            const value = Gameboard.getCell(i, j);
            cell.textContent = value === 1 ? "X" : value === 0 ? "O" : "";
        });
    };
    // fn to update player scores
    const updateScore = (players) => {
        p1score.textContent = players[0].score;
        p2score.textContent = players[1].score;
    };
    // fn to update player Details
    const updateName = (players) => {
        p1name.textContent = players[0].name;
        p2name.textContent = players[1].name;
    };
    // fn to update turn indicator message
    const updateMessage = (message) => { turnIndicator.textContent = message };

    return {renderBoard, updateScore, updateName, updateMessage };
})();

const Game = (function() {
    // game state variables
    let turn = 1;
    let matchOver = true;
    const players = [
        Player("Player O", "O"),
        Player("Player X", "X")
    ];

    const startGame = (playerO, playerX) => {
        // set player details
        players[0].name = playerO;
        players[1].name = playerX;
        // set player name doms
        DisplayController.updateName(players);
        // set player scores to 0
        players[0].score = players[1].score = 0;
        // set player score doms
        DisplayController.updateScore(players);
        // start match
        startMatch();
    };
    const startMatch = () => {
        matchOver = false;
        // clear gameboard
        Gameboard.reset();
        // re-render grid Dom
        DisplayController.renderBoard();
        // set turn to 1 i.e X
        turn = 1;
        // set turn indicator message
        DisplayController.updateMessage(`${players[turn].name}'s turn`);
    };
    const endMatch = (won) => {
        matchOver = true;
        // handle case where won === -1 -> Tie
        if (won === -1) {
            DisplayController.updateMessage(`This match was a tie!`);
            return;
        }
        // update score of won player
        players[won].score++;
        console.log(players[won]);
        // update score dom
        DisplayController.updateScore(players);
        // update turn indicator message to Player[won] won
        DisplayController.updateMessage(`${players[won].name} won 🎉!!`);
    }
    const play = (index) => {
        if(matchOver) return;

        const {i, j} = Gameboard.getIndex(index);

        // update Gameboard and dom
        if (Gameboard.getCell(i, j) === -1) {
            Gameboard.setCell(i, j, turn);
            DisplayController.renderBoard();
            // log grid on console
            Gameboard.print();

            // evaluate if match is over
            let won = evaluate();
            if (won !== -1 || Gameboard.isFull()) {
                endMatch(won);
                return;
            } 

            // update turn
            turn = turn === 0 ? 1 : 0;

            // update turn message
            DisplayController.updateMessage(`${players[turn].name}'s turn`);
        } else {
            alert("Invalid Move");
        }
    };
    
    /**
     * @returns 1 (if 1 won), 0 (if 0 won), -1 otherwise
     */
    const evaluate = () => {
        const grid = Gameboard.getCell;
        for (let i = 0; i < 3; i++) {
            if (grid(i, 0) === grid(i, 1) && grid(i, 1) === grid(i, 2) && grid(i, 0) !== -1) 
                return grid(i, 0);
            if (grid(0, i) === grid(1, i) && grid(1, i) === grid(2, i) && grid(0, i) !== -1) 
                return grid(0, i);
        }
        if (grid(0, 0) === grid(1, 1) && grid(1, 1) === grid(2, 2) && grid(0, 0) !== -1) 
            return grid(0, 0);
        if (grid(0, 2) === grid(1, 1) && grid(1, 1) === grid(2, 0) && grid(0, 2) !== -1) 
            return grid(0, 2);
        return -1;
    };

    return { startGame, startMatch, endMatch, play };
})();

function main() {
    // dom elements
    const dialogBox = document.querySelector(".player-names");
    const dialogForm = document.querySelector(".player-names form");
    const dialogCloseButton = document.querySelector("form .close");
    const gridDom = document.querySelector("main .grid");
    const restartGameButton = document.querySelector("main .restart-game");
    const restartMatchButton = document.querySelector("main .restart-match");

    Gameboard.reset();
    DisplayController.renderBoard();
    gridDom.addEventListener("click", (e) => {
        const children = Array.from(gridDom.children);
        const index = children.indexOf(e.target);
        Game.play(index);
    });
    restartGameButton.addEventListener("click", () => dialogBox.showModal());
    dialogForm.addEventListener("submit", (event) => {
        event.preventDefault(); // prevent default action of form sending data to server

        restartMatchButton.addEventListener("click", () => Game.startMatch());

        const playerO = document.getElementById("playero").value.trim();
        const playerX = document.getElementById("playerx").value.trim();

        Game.startGame(playerO, playerX);

        // reset form
        event.target.reset();

        // close dialog
        dialogBox.close();
    });
    dialogCloseButton.addEventListener("click", () => {
        dialogForm.reset();
        dialogBox.close();
    });
}

main();