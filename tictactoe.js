loadEventListeners();

class Cell {
    constructor(cell) {
        this._cell = cell;

        for(let i = 1; i <= 3; i++) {
            if (cell.classList.contains('col' + i))
                this.column = i;
            if (cell.classList.contains('row' + i))
                this.row = i;
        }
        this.id = cell.id;
        this.position = parseInt(cell.id.slice(-1));        
    }

    isOpen() {
        return this._cell.classList.contains('open-cell');
    }

    mark(player) {
        this._cell.classList.remove('open-cell');
        this._cell.innerText = player.token;
        this._player = player;
    }

    getPlayer() {
        return this._player;
    }

    markAsWinner() {
        this._cell.classList.add('winning-cell');
    }
    markAsUnavailable() {
        this._cell.classList.remove('open-cell');
    }

    clear(player) {
        this._cell.classList.add('open-cell');
        this._cell.classList.remove('winning-cell');
        this._cell.innerHTML = '&nbsp;';
        this._player = undefined;
    }    
}

class UI {
    static board = document.getElementById('board');
    static cells = Array.from(this.board.querySelectorAll('td')).map(cell => new Cell(cell));

    static clearBoard() {
        this.cells.forEach(function(cell) {
            cell.clear();
        })
    }

    static reportDraw() {
        UI.setInstruction('The game is a draw');
        UI.incrementDrawCount();
        UI.showPlayAgain();
    }

    static reportWinner(winningLine) {
        winningLine.cells.forEach(cell => cell.markAsWinner());
        this.cells.forEach(cell => cell.markAsUnavailable());
        const player = winningLine.winningPlayer();
        UI.setInstruction('Player ' + player.token + ' won.');
        player.incrementScore();
        UI.showPlayAgain();
    }

    static incrementScore(idSuffix) {
        const id = 'score-' + idSuffix.toLowerCase();
        const scoreBox = document
            .getElementById(id);
        let value = parseInt(scoreBox.innerText);
        scoreBox.innerText = value + 1;   
    }

    static btnPlayAgain = document.getElementById('btnPlayAgain');
    static showPlayAgain() {
        btnPlayAgain.style.display = "inline";
        btnPlayAgain.focus();
    }
    static hidePlayAgain() {
        btnPlayAgain.style.display = "none";
    }

    static setInstruction(message) {
        document.getElementById("quickHelp").innerText = message;
    }

    static _drawCount = 0;
    static incrementDrawCount() {
        this._drawCount++;
        document.getElementById('score-draw').innerText = this._drawCount;
    }
}

class Player {
    constructor(token) {
        this.token = token;
        this._score = 0;
    }
    
    incrementScore() {
        this._score++;
        document.getElementById('score-' + this.token.toLowerCase()).innerText = this._score;
    }
}


class Line {
    constructor(cells) {
        this.cells = Array.from(cells);
    }

    isWinner() {
        const players = this.cells
            .filter(cell => !cell.isOpen())
            .map(cell => cell.getPlayer());

        if (players.length < this.cells.length)
            return false;

        const firstPlayer = players[0];
        return players.every(x => x === firstPlayer);
    }

    winningPlayer() {
        if (this.isWinner())
            return this.cells[0].getPlayer();
    }

}

class Game {
    static playerX = new Player('X');
    static playerO = new Player('O');
    static currentPlayer = this.playerO;
    static switchPlayer() {
        if (this.currentPlayer === this.playerX)
            this.currentPlayer = this.playerO;
        else
            this.currentPlayer = this.playerX;

        UI.setInstruction("It is player " + this.currentPlayer.token + "'s turn.");
    }

    static startGame() {
        UI.hidePlayAgain();
        UI.clearBoard();
        this.switchPlayer();
    }

    static selectCell(cell) {
        cell.mark(this.currentPlayer);

        if (this.isGameOver()) {
            if (this.isDraw())
                UI.reportDraw();
            else
                UI.reportWinner(this.winningLine());
        }
        else {
            this.switchPlayer();
        }
    }
    
    static _lines = [
        new Line(UI.cells.filter(cell => cell.column === 1)),
        new Line(UI.cells.filter(cell => cell.column === 2)),
        new Line(UI.cells.filter(cell => cell.column === 3)),
        new Line(UI.cells.filter(cell => cell.row === 1)),
        new Line(UI.cells.filter(cell => cell.row === 2)),
        new Line(UI.cells.filter(cell => cell.row === 3)),
        new Line(UI.cells.filter(cell => [7,5,3].includes(cell.position))),
        new Line(UI.cells.filter(cell => [1,5,9].includes(cell.position)))
    ]

    static winningLine() {
        return this._lines.filter(line => line.isWinner())[0] || null;
    }

    static isGameOver() {
        const emptyCells = UI.cells.filter(cell => cell.isOpen());
        return emptyCells.length === 0 || this.winningLine() !== null;
    }

    static isDraw() {
        return this.isGameOver() && this.winningLine() === null;
    }

}



function loadEventListeners() {
    document.getElementById('board').addEventListener('click', select);
    document.getElementById('btnPlayAgain').addEventListener('click', playAgain);
}

function select(e) {    
    if (e.target.classList.contains('open-cell')){
        cell = UI.cells.filter(x => x.id === e.target.id)[0];
        Game.selectCell(cell);
    }
}

function playAgain() {
    Game.startGame();
}

Game.startGame();

