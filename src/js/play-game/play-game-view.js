import { observer } from '../store/observer';


export default class PlayGameView {
  constructor(model) {
    this.model = model.currentPlayers;

    this.anchor = document.querySelector('.app');
    this.templateElement = document.querySelector('.play-game').content.cloneNode(true);
    this.anchor.innerHTML = '';
    this.anchor.appendChild(this.templateElement);

    this.messageWindow = document.querySelector('.play-game__header-message-window');
    this.messageWindow.innerText = ` ${this.model[0].nick} has to turn now`;

    this.gameTable = document.querySelector('.play-game__main-section-table');
    this.cells = this.gameTable.querySelectorAll('td');
    this.newGameButton = document.querySelector('.play-game__main-new-game-button');

    this.playerSymbol = 'x';

    this.resetGame = this.resetGame.bind(this);

    this.init();
  }

  init() {
    // console.log('Play game component initialized');
    this.scoreTable();
    this.setupListeners();
  }

  setupListeners() {
    this.cells.forEach((item) => item.addEventListener('click', this.handleSteps));

    this.newGameButton.addEventListener('click', this.resetGame);
  }

  handleSteps = (event) => {
    const clickedCellData = +event.target.getAttribute('data-cell');
    const CLASS_LIST_MAP = {
      x: 'x-color',
      o: 'y-color',
    };
    /* eslint-disable no-param-reassign */
    event.target.innerText = this.playerSymbol;
    event.target.classList.add(CLASS_LIST_MAP[this.playerSymbol]);

    observer.fire('playerStep', [clickedCellData, this.playerSymbol]);

    this.changePlayer(this.playerSymbol);
    event.target.removeEventListener('click', this.handleSteps);
  };

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
    this.cells.forEach((item) => item.removeEventListener('click', this.handleSteps));
  }

  bindMessageWinner() {
    if (this.playerSymbol === 'x') {
      this.messageWindow.innerText = `${this.model[0].nick} win!`;
    } else {
      this.messageWindow.innerText = `${this.model[1].nick} win!`;
    }
  }

  scoreTable() {
    const [firstPlayer, secondPlayer] = this.model;
    const elements = [
      {
        nickID: 'first_player_nick',
        scoreID: 'first_player_score',
        nick: firstPlayer.nick,
        score: firstPlayer.score,
      },
      {
        nickID: 'second_player_nick',
        scoreID: 'second_player_score',
        nick: secondPlayer.nick,
        score: secondPlayer.score,
      },
    ];
    elements.forEach((currentItem) => {
      document.getElementById(`${currentItem.nickID}`).innerText = currentItem.nick;
      document.getElementById(`${currentItem.scoreID}`).innerText = currentItem.score;
    });
  }

  resetGame() {
    this.playerSymbol = 'x';
    this.cells.forEach((item) => {
      item.innerText = '';
      item.classList.remove('x-color');
      item.classList.remove('y-color');
      observer.fire('resetGame');
    });
    this.messageWindow.innerText = ` ${this.model[0].nick} has to turn now`;
    this.setupListeners();
  }
}
