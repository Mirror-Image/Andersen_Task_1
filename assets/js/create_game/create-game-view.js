import {observer} from "../store/observer.js";

export default class CreateGameView {
  constructor(model) {
    this.model = model;

    this.anchor = document.querySelector("body");
    this.templateElement = document.querySelector('.create-game')
      .content.cloneNode(true);
    this.anchor.appendChild(this.templateElement);

    this.firstPlayerSymbol = document.querySelector('.player-1');
    this.seconsPlayerSymbol = document.getElementById('second_player_symbol');

    this.joinGameButton = document.querySelector('.create-game__main-form-button');
    this.newPlayersButton = document.querySelector('.create-game__main-form-new-players-button');

    this.init();
  }

  init() {
    console.log( 'Create game component initialized' );
    this.setupListeners();
  }

  setupListeners() {
    //TODO: newPlayersButton!
    this.joinGameButton.addEventListener('click', this.handleJoinGame.bind(this));
    this.firstPlayerSymbol.addEventListener("click", this.handleSecondPlayerSymbol.bind(this));
  }

  handleJoinGame(event) {
    event.preventDefault();

    let nickNamePlayer1 = document.querySelector('#player-1-nickname').value;
    let nickNamePlayer2 = document.querySelector('#player-2-nickname').value;

    let symbol = document.getElementById('x').getAttribute('checked');

    if (symbol) {
      observer.fire('newPlayers', [
          { nick: nickNamePlayer1, symbol: 'x' },
          { nick: nickNamePlayer2, symbol: 'o' }
        ]
      );
    } else {
      observer.fire('newPlayers', [
        { nick: nickNamePlayer1, symbol: 'o' },
        { nick: nickNamePlayer2, symbol: 'x' }]
      );
    }

    //TODO: add fire of PlayGameComponent;
  }

  handleSecondPlayerSymbol(event) {
    let target = event.target;
    if (target.id === 'x') {
      this.seconsPlayerSymbol.innerText = 'Your symbol is "O"';
    } else if (target.id === 'o') {
      this.seconsPlayerSymbol.innerText = 'Your symbol is "X"'
    }
  }
}