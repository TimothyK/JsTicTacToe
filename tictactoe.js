loadEventListeners();


class UI {

    static cells = Array.from(document.querySelectorAll('td'));

    static clearBoard() {
        this.cells.forEach(function(cell) {
            cell.innerHTML = '&nbsp;';
            cell.classList.add('open-cell');
        })
    }

    static markCell(cell, player) {
        cell.classList.remove('open-cell');
        cell.innerText = player.token;
    }

    static reportDraw() {
        UI.setInstruction('The game is a draw');
    }

    static reportWinner(winningLine) {
        winningLine.cells.forEach(cell => cell.classList.add('winning-cell'));
        this.cells.forEach(cell => cell.classList.remove('open-cell'));
        UI.setInstruction('Player ' + winningLine.winningPlayerToken() + ' won.');
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

    hasWinner() {
        const tokens = this.cells
            .filter(cell => !cell.classList.contains('open-cell'))
            .map(cell => cell.innerText);

        if (tokens.length < this.cells.length)
            return false;

        const firstToken = tokens[0];
        return tokens.every(x => x === firstToken);
    }

    winningPlayerToken() {
        if (this.hasWinner())
            return this.cells[0].innerText;
    }

}

class Game {
    static playerX = new Player('X');
    static playerO = new Player('O');

    static startGame() {
        UI.clearBoard();
        this.switchPlayer();
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

    static currentPlayer;

    static selectCell(cell) {
        UI.markCell(cell, this.currentPlayer);  
        this.switchPlayer();

        if (this.isGameOver()) {
            if (this.isDraw())
                UI.reportDraw();
            else
                UI.reportWinner(this.winningLine());
        }
    }

    static winningLine() {
        return this.lines.filter(line => line.hasWinner())[0] || null;
    }

    static isGameOver() {
        const emptyCells = UI.cells.filter(cell => cell.classList.contains('open-cell'));
        return emptyCells.length === 0 || this.winningLine() !== null;
    }

    static isDraw() {
        return this.isGameOver() && !this.winningLine();
    }

    static switchPlayer() {
        if (this.currentPlayer === this.playerO)
            this.currentPlayer = this.playerX;
        else
            this.currentPlayer = this.playerO;

        UI.setInstruction("It is player " + this.currentPlayer.token + "'s turn.");
    }


}



function loadEventListeners() {
    document.getElementById('board').addEventListener('click', select);
}

function select(e) {    
    if (e.target.classList.contains('open-cell')){
        Game.selectCell(e.target);
    }
}

Game.startGame();