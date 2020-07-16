loadEventListeners();


class UI {
    static board = document.getElementById('board');
    static cells = Array.from(this.board.querySelectorAll('td'));

    static clearBoard() {
        this.cells.forEach(function(cell) {
            cell.innerHTML = '&nbsp;';
            cell.classList.add('open-cell');
            cell.classList.remove('winning-cell');
        })
    }

    static markCell(cell, player) {
        cell.classList.remove('open-cell');
        cell.innerText = player.token;
    }

    static reportDraw() {
        UI.setInstruction('The game is a draw');
        UI.incrementScore('draw');
        UI.showPlayAgain();
    }

    static reportWinner(winningLine) {
        winningLine.cells.forEach(cell => cell.classList.add('winning-cell'));
        this.cells.forEach(cell => cell.classList.remove('open-cell'));
        UI.setInstruction('Player ' + winningLine.winningPlayerToken() + ' won.');
        UI.incrementScore(winningLine.winningPlayerToken());
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
}

class Player {
    constructor(token) {
        this.token = token;
    }
}

class Line {
    constructor(cells) {
        this.cells = Array.from(cells);
    }

    issWinner() {
        const tokens = this.cells
            .filter(cell => !cell.classList.contains('open-cell'))
            .map(cell => cell.innerText);

        if (tokens.length < this.cells.length)
            return false;

        const firstToken = tokens[0];
        return tokens.every(x => x === firstToken);
    }

    winningPlayerToken() {
        if (this.issWinner())
            return this.cells[0].innerText;
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
        UI.markCell(cell, this.currentPlayer);  
        
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
    static lines = [
        new Line(document.querySelectorAll('.col1')),
        new Line(document.querySelectorAll('.col2')),
        new Line(document.querySelectorAll('.col3')),
        new Line(document.querySelectorAll('.row1')),
        new Line(document.querySelectorAll('.row2')),
        new Line(document.querySelectorAll('.row3')),
        new Line([document.getElementById('cell7'), document.getElementById('cell5'), document.getElementById('cell3')]),
        new Line([document.getElementById('cell1'), document.getElementById('cell5'), document.getElementById('cell9')])
    ]

    static winningLine() {
        return this.lines.filter(line => line.issWinner())[0] || null;
    }

    static isGameOver() {
        const emptyCells = UI.cells.filter(cell => cell.classList.contains('open-cell'));
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
        Game.selectCell(e.target);
    }
}

function playAgain() {
    Game.startGame();
}

Game.startGame();
