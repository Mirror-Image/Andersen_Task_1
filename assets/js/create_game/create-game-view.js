import {observer} from "../store/observer.js";
import PlayGameModel from "../play-game/play-game-model.js";
import PlayGameView from "../play-game/play-game-view.js";
import PlayGameController from "../play-game/play-game-controller.js";


export default class CreateGameView {
  constructor(model) {
    this.model = model;

    this.anchor = document.querySelector("body");
    this.templateElement = document.querySelector('.create-game').content.cloneNode(true);
    this.anchor.appendChild(this.templateElement);

    this.firstPlayerSymbol = document.getElementById('x');
    this.secondPlayerSymbol = document.getElementById('o');
    this.seconsPlayerSymbolMessageArea = document.getElementById('second_player_symbol');

    this.joinGameButton = document.querySelector('.create-game__main-form-button');
    this.newPlayersButton = document.querySelector('.create-game__main-form-new-players-button');

    this.chosenSymbolPlayer1 = 'x';
    this.chosenSymbolPlayer2 = 'o';

    // создаем масив с существующими игроками (для простоты работы в дальнейшем)
    this.nickNamesArray = this.model.model.map(item => item.nick);

    this.init();
  }

  init() {
    console.log( 'Create game component initialized' );
    this.setupListeners();
  }

  setupListeners() {
    let newPlayer1Input = document.querySelector('.new-player-1');
    let newPlayer2Input = document.querySelector('.new-player-2');

    if (newPlayer1Input && newPlayer2Input) {
      newPlayer1Input.addEventListener('keyup', this.checkNewNameInStorage.bind(this));
      newPlayer2Input.addEventListener('keyup', this.checkNewNameInStorage.bind(this));

    } else if (newPlayer1Input || newPlayer2Input) {
      if (newPlayer1Input) {
        newPlayer1Input.addEventListener('keyup', this.checkNewNameInStorage.bind(this));

      } else if (newPlayer2Input) {
        newPlayer2Input.addEventListener('keyup', this.checkNewNameInStorage.bind(this));
      }
    }

    this.newPlayersButton.addEventListener('click', this.newPlayersWindow.bind(this));
    this.joinGameButton.addEventListener('click', this.handleJoinGame.bind(this));
    this.firstPlayerSymbol.addEventListener('click', this.checkSymbolPlayer1.bind(this));
    this.secondPlayerSymbol.addEventListener('click', this.checkSymbolPlayer1.bind(this));

    document.querySelector('.new-players').addEventListener('click', this.handleJoinGame.bind(this));
  }

  checkNewNameInStorage(event) {
    let name = event.target.value;

    console.log( name );

    if (event.target.className === 'create-game__main-form-player-nickname new-player-1') {
      let message = document.querySelector('.message-player-1');

      if (this.checkNameInStorage(this.nickNamesArray, name)) {
        message.innerText = 'This name has already exist'
      } else {
        message.innerText = 'This name is available'
      }
    } else if (event.target.className === 'create-game__main-form-player-nickname new-player-2') {
      let message = document.querySelector('.message-player-2');

      if (this.checkNameInStorage(this.nickNamesArray, name)) {
        message.innerText = 'This name has already exist'
      } else {
        message.innerText = 'This name is available'
      }
    }
  }

  // возвращает значение true или false
  checkNameInStorage(storage, name) {
    return !!(~storage.indexOf(name));
  }

  // определяем каким символом играет Игрок 1
  checkSymbolPlayer1(e) {
    this.toggleSecondPlayerSymbolMessage(e.target.value);
    this.chosenSymbolPlayer1 =  e.target.value;
    this.checkSymbolPlayer2(e.target.value);
  }

  // определяем каким символом играет Игрок 2
  checkSymbolPlayer2(value) {
    if (value === 'x') {
      return this.chosenSymbolPlayer2 = 'o';
    }
    return this.chosenSymbolPlayer2 = 'x';
  }

  // Запускаем игру!
  runPlay() {
    let playGameModel = new PlayGameModel();
    let view = new PlayGameView(playGameModel);
    let playGameController = new PlayGameController(playGameModel, view);
  }

  // Вся логика системы входа и игру
  // TODO: подумать как можно её разбить на более простые методы для удобства восприятия
  handleJoinGame(event) {
    event.preventDefault();

    let inputPlayer1 = document.getElementById('player-1-nickname');
    let inputPlayer2 = document.getElementById('player-2-nickname');

    let nickNamePlayer1 = inputPlayer1.value;
    let nickNamePlayer2 = inputPlayer2.value;

    let dropDownListPlayer1 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-1');
    let dropDownListPlayer2 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-2');

    // проверка введенных имен в существующей базе данных (true/false)
    let player1 = this.checkNameInStorage(this.nickNamesArray, nickNamePlayer1);
    let player2 = this.checkNameInStorage(this.nickNamesArray, nickNamePlayer2);

    //если поля ввода имен игроков не пустые
    if (nickNamePlayer1 && nickNamePlayer2) {

      // если оба игрока уже есть в базе
      if (player1 && player2) {

        // если у нас уже активны выпадающие списки с выбором уже существующих в базе игроков
        if (dropDownListPlayer1 && dropDownListPlayer2) {
          observer.fire('currentPlayersPair', [nickNamePlayer1, nickNamePlayer2]);
          this.runPlay();

        // если нету выпадающих списков но введенные игроки уже есить базе, то взываем сообщение и запускаем форму выбора и подтверждения среди уже существующих игроков
        } else {
          alert('Current users exist. If these are yours - please choose them or create a new');

          this.createDropDownList('player-1', nickNamePlayer1);
          this.createDropDownList('player-2', nickNamePlayer2);

          observer.fire('currentPlayersPair', [nickNamePlayer1, nickNamePlayer2]);
        }

      // если только один из игроков есть в базе
      } else if (player1 || player2) {

        // если уже есть выпадающий список у Игрока 1
        if (dropDownListPlayer1) {
          observer.fire('newPlayers',
            [{nick: nickNamePlayer2, symbol: this.chosenSymbolPlayer2, score: 0}]
          );
          observer.fire('currentPlayersPair', [nickNamePlayer1, nickNamePlayer2]);

          console.log( nickNamePlayer1, nickNamePlayer2 );
          this.runPlay();

          // если уже есть выпадающий список у Игрока 2
        } else if (dropDownListPlayer2) {
          observer.fire('newPlayers',
            [{nick: nickNamePlayer1, symbol: this.chosenSymbolPlayer1, score: 0}]
          );
          observer.fire('currentPlayersPair', [nickNamePlayer1, nickNamePlayer2]);

          this.runPlay();

        // если Игрок 1 уже существует в базе, то заменяем его форму ввода на выпадающий список для выбора и подтверждения среди существующих игроков в базе
        } else if (player1) {
          alert(`Player 1 with nickname ${nickNamePlayer1} has been existed`);
          observer.fire('currentPlayersPair', [nickNamePlayer1, nickNamePlayer2]);

          inputPlayer2.classList.add('new-player-2');
          this.setupListeners();

          this.createDropDownList('player-1', nickNamePlayer1);

        // если Игрок 2 уже существует в базе
        } else if (player2) {
          alert(`Player 2 with nickname ${nickNamePlayer2} has been existed`);
          observer.fire('currentPlayersPair', [nickNamePlayer1, nickNamePlayer2]);

          inputPlayer2.classList.add('new-player-1');
          this.setupListeners();

          this.createDropDownList('player-2', nickNamePlayer2);
        }

      // если оба игрока новые
      } else if (!player1 && !player2) {
        console.log( nickNamePlayer1, nickNamePlayer2 );
        observer.fire('newPlayers', [
          {nick: nickNamePlayer1, symbol: this.chosenSymbolPlayer1, score: 0},
          {nick: nickNamePlayer2, symbol: this.chosenSymbolPlayer2, score: 0}]);
        observer.fire('currentPlayersPair', [nickNamePlayer1, nickNamePlayer2]);

        this.runPlay();

      //TODO: (дублирование кода, еще раз проверить и если что, удалить) если оба игрока уже существуют в базе
      }
      /*else if (player1 && player2) {

        // если оба игрока уже существуют в базе и у них вызваны выпадающие списки для выбора и подтвержения
        if (dropDownListPlayer1 && dropDownListPlayer2) {
          console.log( nickNamePlayer1, nickNamePlayer2 );
          this.runPlay();

        // если оба игрока уже существуют в базе, но мы хотим чтобы они еще раз подтвердили свой выбор (заменем оба поля ввода на выпадающие списки)
        } else {
          alert('Current users exist. If these are yours - please choose them or create a new');

          this.createDropDownList('player-1');
          this.createDropDownList('player-2');
        }
      }*/

    // если оба поля ввода пустые
    } else if (!nickNamePlayer1 && !nickNamePlayer2) {
      alert('Please enter your nicknames in the form below');

    // если поле ввода Игрока 1 пустое
    } else if (!nickNamePlayer1) {
      alert('Player1 enter your nickname');

    // если поле Игрока 2 пустое
    } else if (!nickNamePlayer2) {
      alert('Player2 enter your nickname');
    }
  }

  // выводим сообщение каким символом играет Игрок 2. (зависит от выбора Игрока 1)
  toggleSecondPlayerSymbolMessage(symbol) {
    if (symbol === 'x') {
      this.seconsPlayerSymbolMessageArea.innerText = 'Your symbol is "O"';
    } else if (symbol === 'o') {
      this.seconsPlayerSymbolMessageArea.innerText = 'Your symbol is "X"'
    }
  }

  // заменяем форму ввода на выпадающий список с существующими игроками
  createDropDownList(playerOrder, playerName) {
    let anchor = document.querySelector(`.${playerOrder}`).querySelector('.wrapper');

    let oldChild = document.getElementById(`${playerOrder}-nickname`);
    let select = document.createElement('select');
    anchor.replaceChild(select, oldChild);
    select.className = `create-game__main-form-player-drop-down-nicknames-${playerOrder}`;
    select.id = `${playerOrder}-nickname`;

    let anchorForSelect = document.querySelector(`.create-game__main-form-player-drop-down-nicknames-${playerOrder}`);
    console.log( this.model.model );
    this.model.model.map(item => {
      let option = document.createElement('option');
      option.innerText = `${item.nick}`;
      option.setAttribute('value', item.nick);
      if (item.nick === playerName) {
        option.setAttribute('selected', '');
      }
      anchorForSelect.appendChild(option);
    });
  }

  newPlayersWindow() {
    let newPlayersWindowTemplate = document.querySelector('.new-players').content.cloneNode(true);
    this.anchor.innerHTML = '';
    this.anchor.appendChild(newPlayersWindowTemplate);

    this.setupListeners()
  }
}