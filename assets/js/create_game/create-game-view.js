import {observer} from "../store/observer.js";
import PlayGameModel from "../play-game/play-game-model.js";
import PlayGameView from "../play-game/play-game-view.js";
import PlayGameController from "../play-game/play-game-controller.js";


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

    let dropDownMenuPlayer1 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-1');
    let dropDownMenuPlayer2 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-2');

    let symbol = document.getElementById('x').getAttribute('checked');

    if (nickNamePlayer1 && nickNamePlayer2) {
      let nickNamesArray = this.model.model.map(item => item.nick);
      console.log( nickNamesArray );

      if ((nickNamesArray.indexOf(nickNamePlayer1) === -1 ||
          nickNamesArray.indexOf(nickNamePlayer2) === -1) &&
        (nickNamesArray.indexOf(nickNamePlayer2) !== -1 && nickNamesArray.indexOf(nickNamePlayer2) !== -1)) {
        if (nickNamesArray.indexOf(nickNamePlayer2) !== -1) {
          if (dropDownMenuPlayer2) {
            observer.fire('newPlayers',
                [{nick: nickNamePlayer1, symbol: 'test', score: 0}]
            );

            let playGameModel = new PlayGameModel();
            let view = new PlayGameView(playGameModel);
            let playGameController = new PlayGameController(playGameModel, view);

          } else {
            alert(`Player 2 with nickname ${nickNamePlayer2} has been existed`);
            this.createDropDownList('player-2');

          }
        } else {
          if (dropDownMenuPlayer1) {
            observer.fire('newPlayers',
                {nick: nickNamePlayer2, symbol: 'test', score: 0}

            );

            let playGameModel = new PlayGameModel();
            let view = new PlayGameView(playGameModel);
            let playGameController = new PlayGameController(playGameModel, view);

          } else {
            alert(`Player 1 with nickname ${nickNamePlayer1} has been existed`);
            this.createDropDownList('player-1');
          }
        }
      } else if (nickNamesArray.indexOf(nickNamePlayer2) !== -1 &&
        nickNamesArray.indexOf(nickNamePlayer1) !== -1) {

        if (dropDownMenuPlayer1 && dropDownMenuPlayer2) {
          let playGameModel = new PlayGameModel();
          let view = new PlayGameView(playGameModel);
          let playGameController = new PlayGameController(playGameModel, view);

        } else {
          alert('Current users exist. If these are yours - please choose them or create a new');

          this.createDropDownList('player-1');
          this.createDropDownList('player-2');
        }

      } else if (nickNamesArray.indexOf(nickNamePlayer2) === -1 &&
        nickNamesArray.indexOf(nickNamePlayer1) === -1) {
        if (symbol) {
          observer.fire('newPlayers', [
              {nick: nickNamePlayer1, symbol: 'x', score: 0},
              {nick: nickNamePlayer2, symbol: 'o', score: 0}
            ]
          );
        } else {
          observer.fire('newPlayers', [
            {nick: nickNamePlayer1, symbol: 'o', score: 0},
            {nick: nickNamePlayer2, symbol: 'x', score: 0}]);
        }

        let playGameModel = new PlayGameModel();
        let view = new PlayGameView(playGameModel);
        let playGameController = new PlayGameController(playGameModel, view);
      }
    } else {
      if (!nickNamePlayer1) {
        alert('Please enter Player 1 nickname');
      } else {
        alert('Please enter Player 2 nickname');
      }
    }
  }

  handleSecondPlayerSymbol(event) {
    let target = event.target;
    if (target.id === 'x') {
      this.seconsPlayerSymbol.innerText = 'Your symbol is "O"';
    } else if (target.id === 'o') {
      this.seconsPlayerSymbol.innerText = 'Your symbol is "X"'
    }
  }

  createDropDownList(player) {
    let anchor = document.querySelector(`.${player}`).querySelector('.wrapper');

    let oldChild = document.getElementById(`${player}-nickname`);
    let select = document.createElement('select');
    anchor.replaceChild(select, oldChild);
    select.className = `create-game__main-form-player-drop-down-nicknames-${player}`;
    select.id = `${player}-nickname`;


    let anchorForSelect = document.querySelector(`.create-game__main-form-player-drop-down-nicknames-${player}`);
    console.log( this.model.model );
    this.model.model.map(item => {
      let option = document.createElement('option');
      option.innerText = `${item.nick}`;
      option.setAttribute('value', item.nick);
      anchorForSelect.appendChild(option);
    })
  }
}