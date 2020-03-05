import { observer } from '../store/observer';


export default class PlayGameView {
  constructor(model) {
    this.model = model.currentPlayers;

    this.anchor = document.querySelector('.app');
    this.templateElement = document.querySelector('.play-game').content.cloneNode(true);
    this.anchor.innerHTML = '';
    this.anchor.appendChild(this.templateElement);

    this.messageWindow = document.querySelector('.play-game__header-message-window');
    this.gameTable = document.querySelector('.play-game__main-section-table');
    this.cells = this.gameTable.querySelectorAll('td');
    this.newGameButton = document.querySelector('.play-game__main-new-game-button');

    this.handleSteps = function steps(event) {
      const clickedCellData = +event.target.getAttribute('data-cell');
      /* eslint-disable no-param-reassign */
      event.target.innerText = this.playerSymbol;

      observer.fire('playerStep', [clickedCellData, this.playerSymbol]);

      this.changePlayer(this.playerSymbol);
    };

    this.playerSymbol = 'x';

    this.init();
  }

  init() {
    // console.log('Play game component initialized');
    this.scoreTable();
    this.setupListeners();
  }

  setupListeners() {
    this.cells.forEach((item) => item.addEventListener('click', this.test));

    this.newGameButton.addEventListener('click', this.resetGame.bind(this));
  }

  handleSteps(event) {
    const clickedCellData = +event.target.getAttribute('data-cell');
    /* eslint-disable no-param-reassign */
    event.target.innerText = this.playerSymbol;

    observer.fire('playerStep', [clickedCellData, this.playerSymbol]);

    this.changePlayer(this.playerSymbol);
  }

  test = this.handleSteps.bind(this);

  changePlayer(player) {
    player === 'x' ? this.playerSymbol = 'o' : this.playerSymbol = 'x';
  }

  bindMessageNoWinner() {
    this.messageWindow.innerText = "That's a draw, brothers! Next time be more attentive!";
  }

  bindMessageNextPlayer() {
    this.playerSymbol === 'x'
      ? this.messageWindow.innerText = `Next turn ${this.model[1].nick}`
      : this.messageWindow.innerText = `Next turn ${this.model[0].nick}`;
  }

  bindRemoveListeners() {
    this.cells.forEach((item) => item.removeEventListener('click', this.test));
  }

  bindMessageWinner() {
    if (this.playerSymbol === 'x') {
      this.messageWindow.innerText = `${this.model[0].nick} win!`;
    } else {
      this.messageWindow.innerText = `${this.model[1].nick} win!`;
    }
  }

  scoreTable() {
    const nickPayer1 = document.getElementById('first_player_nick');
    const nickPayer2 = document.getElementById('second_player_nick');

    const scorePayer1 = document.getElementById('first_player_score');
    const scorePayer2 = document.getElementById('second_player_score');

    nickPayer1.innerText = this.model[0].nick;
    nickPayer2.innerText = this.model[1].nick;

    scorePayer1.innerText = this.model[0].currentScore;
    scorePayer2.innerText = this.model[1].currentScore;
  }

  resetGame() {
    this.playerSymbol = 'x';
    this.cells.forEach((item) => {
      item.innerText = '';
      observer.fire('resetGame');
    });
    this.setupListeners();
  }
}
