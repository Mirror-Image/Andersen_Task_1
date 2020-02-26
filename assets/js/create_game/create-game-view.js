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

    this.firstPlayerSymbol = document.getElementById('x');
    this.secondPlayerSymbol = document.getElementById('o');
    this.seconsPlayerSymbolMessageArea = document.getElementById('second_player_symbol');

    this.joinGameButton = document.querySelector('.create-game__main-form-button');
    this.newPlayersButton = document.querySelector('.create-game__main-form-new-players-button');

    this.chosenSymbolPlayer1 = 'x';
    this.chosenSymbolPlayer2 = 'o';

    this.init();
  }

  init() {
    console.log( 'Create game component initialized' );
    this.setupListeners();
  }

  setupListeners() {
    //TODO: newPlayersButton!
    this.joinGameButton.addEventListener('click', this.handleJoinGame.bind(this));
    // this.firstPlayerSymbol.addEventListener("click", this.handleSecondPlayerSymbol.bind(this));
    this.firstPlayerSymbol.addEventListener('click', this.checkSymbolPlayer1.bind(this));
    this.secondPlayerSymbol.addEventListener('click', this.checkSymbolPlayer1.bind(this));
  }

  checkNameInStorage(storage, name) {
    return !!(~storage.indexOf(name));
  }

  checkSymbolPlayer1(e) {
    this.toggleSecondPlayerSymbolMessage(e.target.value);
    this.chosenSymbolPlayer1 =  e.target.value;
    this.checkSymbolPlayer2(e.target.value);
  }

  checkSymbolPlayer2(value) {
    if (value === 'x') {
      return this.chosenSymbolPlayer2 = 'o';
    }
    return this.chosenSymbolPlayer2 = 'x';
  }

  runPlay() {
    let playGameModel = new PlayGameModel();
    let view = new PlayGameView(playGameModel);
    let playGameController = new PlayGameController(playGameModel, view);
  }

  handleJoinGame(event) {
    event.preventDefault();

    let nickNamePlayer1 = document.querySelector('#player-1-nickname').value;
    let nickNamePlayer2 = document.querySelector('#player-2-nickname').value;

    let dropDownMenuPlayer1 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-1');
    let dropDownMenuPlayer2 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-2');

    let nickNamesArray = this.model.model.map(item => item.nick);
    console.log( nickNamesArray );

    let player1 = this.checkNameInStorage(nickNamesArray, nickNamePlayer1);
    let player2 = this.checkNameInStorage(nickNamesArray, nickNamePlayer2);

    console.log( this.chosenSymbolPlayer2 );

    if (nickNamePlayer1 && nickNamePlayer2) {

      if (player1 && player2) {
        if (dropDownMenuPlayer1 && dropDownMenuPlayer2) {
          this.runPlay();
        } else {
          alert('Current users exist. If these are yours - please choose them or create a new');

          this.createDropDownList('player-1');
          this.createDropDownList('player-2');
        }

      } else if (player1 || player2) {
        if (dropDownMenuPlayer1) {
          observer.fire('newPlayers',
            [{nick: nickNamePlayer2, symbol: 'test', score: 0}]
          );
          this.runPlay();

        } else if (dropDownMenuPlayer2) {
          observer.fire('newPlayers',
            [{nick: nickNamePlayer1, symbol: 'test', score: 0}]
          );
          this.runPlay();

        } else if (player1) {
          alert(`Player 1 with nickname ${nickNamePlayer1} has been existed`);
          this.createDropDownList('player-1');

        } else if (player2) {
          alert(`Player 2 with nickname ${nickNamePlayer2} has been existed`);
          this.createDropDownList('player-2');
        }

      } else if (!player1 && !player2) {
        observer.fire('newPlayers', [
          {nick: nickNamePlayer1, symbol: 'o', score: 0},
          {nick: nickNamePlayer2, symbol: 'x', score: 0}]);
        this.runPlay();
      } else if (player1 && player2) {
        if (dropDownMenuPlayer1 && dropDownMenuPlayer2) {
          this.runPlay();
        } else {
          alert('Current users exist. If these are yours - please choose them or create a new');

          this.createDropDownList('player-1');
          this.createDropDownList('player-2');
        }
      }
    } else if (!player1 && !player2) {
      alert('Please enter your nicknames in the form below');

    } else if (!player1) {
      alert('Player1 enter your nickname');

    } else if (!player2) {
      alert('Player2 enter your nickname');

    }
  }

  toggleSecondPlayerSymbolMessage(symbol) {
    if (symbol === 'x') {
      this.seconsPlayerSymbolMessageArea.innerText = 'Your symbol is "O"';
    } else if (symbol === 'o') {
      this.seconsPlayerSymbolMessageArea.innerText = 'Your symbol is "X"'
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