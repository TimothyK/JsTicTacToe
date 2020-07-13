loadEventListeners();


class UI {

    static cells = document.querySelectorAll('td');

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

    static setInstruction(message) {
        document.getElementById("quickHelp").innerText = message;
    }
}

class Player {
    constructor(token) {
        this.token = token;
    }
}

class Game {
    static playerX = new Player('X');
    static playerO = new Player('O');

    static startGame() {
        UI.clearBoard();
        this.switchPlayer();
    }

    static currentPlayer;

    static selectCell(cell) {
        UI.markCell(cell, this.currentPlayer);  
        this.switchPlayer();
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