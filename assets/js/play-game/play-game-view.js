import {observer} from "../store/observer.js";


export default class PlayGameView {
  constructor(model) {
    this.model = model;

    this.anchor = document.querySelector("body");
    this.templateElement = document.querySelector('.play-game').content.cloneNode(true);
    this.anchor.innerHTML = '';
    this.anchor.appendChild(this.templateElement);

    this.messageWindow = document.querySelector('.play-game__header-message-window');
    this.cells = document.querySelectorAll('td');
    this.newGameButton = document.querySelector('.play-game__main-new-game-button');

    this.playerSymbol = 'x';

    this.init();
  }

  init() {
    console.log( 'Play game component initialized' );
    this.setupListeners();
  }

  setupListeners() {
    this.cells.forEach(item =>
      item.addEventListener('click', this.handleSteps.bind(this)));

    // TODO: NewGame button listener
  }

  handleSteps(event) {
    let clickedCellData = +event.target.getAttribute('data-cell');

    event.target.innerText = this.playerSymbol;

    observer.fire('playerStep', [clickedCellData, this.playerSymbol]);

    this.changePlayer(this.playerSymbol);
  }

  changePlayer(player) {
    player === 'x' ? this.playerSymbol = 'o' : this.playerSymbol = 'x'
  }

  bindMessageNoWinner() {
    this.messageWindow.innerText = "That's a draw, brothers! Next time be more attentive!";
  }

  bindMessageNextPlayer() {
    this.playerSymbol === 'x' ?
      this.messageWindow.innerText =
        'Next turn Player 2' :
      this.messageWindow.innerText = 'Next turn Player 1';
  }

  bindWinnerFound() {
    this.cells.forEach(item =>
    item.removeEventListener('click', this.handleSteps.bind(this)));
  }

  bindMessageWinner() {
    console.log( this.playerSymbol );
    if (this.playerSymbol === 'x') {
      this.messageWindow.innerText =
        'Player 1 win!';
    } else {
      this.messageWindow.innerText =
        'Player 2 win!';
    }
  }
}