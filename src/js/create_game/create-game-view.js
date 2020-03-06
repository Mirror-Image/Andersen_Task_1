import { observer } from '../store/observer';
import PlayGameModel from '../play-game/play-game-model';
import PlayGameView from '../play-game/play-game-view';
import PlayGameController from '../play-game/play-game-controller';


export default class CreateGameView {
  constructor(model) {
    this.model = model;

    this.anchor = document.querySelector('.app');
    this.templateElement = document.querySelector('.create-game').content.cloneNode(true);
    this.anchor.appendChild(this.templateElement);

    this.firstPlayerSymbol = document.getElementById('x');
    this.secondPlayerSymbol = document.getElementById('o');
    this.seconsPlayerSymbolMessageArea = document.getElementById('second_player_symbol');

    this.notificationPlace = document.querySelector('.create-game__main-notification');
    this.joinGameButton = document.querySelector('.create-game__main-form-button');

    this.chosenSymbolPlayer1 = 'x';
    this.chosenSymbolPlayer2 = 'o';

    // создаем масив с существующими игроками (для простоты работы в дальнейшем)
    this.nickNamesArray = this.model.model.map((item) => item.nick);

    this.init();
  }

  init() {
    // console.log('Create game component initialized');
    this.setupListeners();
  }

  setupListeners() {
    const newPlayer1Input = document.getElementById('player-1-nickname');
    const newPlayer2Input = document.getElementById('player-2-nickname');

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

    this.joinGameButton.addEventListener('click', this.handleJoinGame.bind(this));
    this.firstPlayerSymbol.addEventListener('click', this.checkSymbolPlayer1.bind(this));
    this.secondPlayerSymbol.addEventListener('click', this.checkSymbolPlayer1.bind(this));
  }

  checkNewNameInStorage(event) {
    const name = event.target.value;

    if (event.target.className === 'create-game__main-form-player-nickname new-player-1') {
      const message = document.querySelector('.message-player-1');

      if (this.checkNameInStorage(this.nickNamesArray, name)) {
        message.innerText = 'This name has already exist';
      } else {
        message.innerText = 'This name is available';
      }
    } else if (event.target.className === 'create-game__main-form-player-nickname new-player-2') {
      const message = document.querySelector('.message-player-2');

      if (this.checkNameInStorage(this.nickNamesArray, name)) {
        message.innerText = 'This name has already exist';
      } else {
        message.innerText = 'This name is available';
      }
    }
  }

  // возвращает значение true или false
  checkNameInStorage = (storage, name) => (storage.indexOf(name) !== -1);

  // определяем каким символом играет Игрок 1
  checkSymbolPlayer1(e) {
    this.toggleSecondPlayerSymbolMessage(e.target.value);
    this.chosenSymbolPlayer1 = e.target.value;
    this.checkSymbolPlayer2(e.target.value);
  }

  // определяем каким символом играет Игрок 2
  checkSymbolPlayer2(value) {
    if (value === 'x') {
      this.chosenSymbolPlayer2 = 'o';
    } else {
      this.chosenSymbolPlayer2 = 'x';
    }
  }

  // Запускаем игру!
  runPlay = () => {
    const playGameModel = new PlayGameModel();
    const view = new PlayGameView(playGameModel);
    /* eslint-disable no-new */
    new PlayGameController(playGameModel, view);
  };

  // Вся логика системы входа и игру
  // TODO: подумать как можно её разбить на более простые методы для удобства восприятия
  handleJoinGame(event) {
    event.preventDefault();

    const inputPlayer1 = document.getElementById('player-1-nickname');
    const inputPlayer2 = document.getElementById('player-2-nickname');

    const nickNamePlayer1 = inputPlayer1.value;
    const nickNamePlayer2 = inputPlayer2.value;

    const dropDownListPlayer1 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-1');
    const dropDownListPlayer2 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-2');

    // проверка введенных имен в существующей базе данных (true/false)
    const player1 = this.checkNameInStorage(this.nickNamesArray, nickNamePlayer1);
    const player2 = this.checkNameInStorage(this.nickNamesArray, nickNamePlayer2);

    // если поля ввода имен игроков не пустые
    if (nickNamePlayer1 && nickNamePlayer2) {
      if (nickNamePlayer1 === nickNamePlayer2) {
        this.notificationPlace.innerText = 'You both are trying to enter the same nicknames. '
          + 'Please enter the different ones';

        // если оба игрока уже есть в базе
      } else if (player1 && player2) {
        // если у нас уже активны выпадающие списки с выбором уже существующих в базе игроков
        if (dropDownListPlayer1 && dropDownListPlayer2) {
          observer.fire('currentPlayersPair', [
            { nick: nickNamePlayer1, symbol: this.chosenSymbolPlayer1, currentScore: 0 },
            { nick: nickNamePlayer2, symbol: this.chosenSymbolPlayer2, currentScore: 0 }]);

          this.runPlay();

        // если нету выпадающих списков но введенные игроки уже есить базе, то взываем сообщение и запускаем форму выбора и подтверждения среди уже существующих игроков
        } else {
          this.notificationPlace.innerText = 'Current users have been existed. '
            + 'If these are yours - please choose them or create a new ones';
          this.createDropDownList('player-1', nickNamePlayer1);
          this.createDropDownList('player-2', nickNamePlayer2);
        }

      // если только один из игроков есть в базе
      } else if (player1 || player2) {
        // если уже есть выпадающий список у Игрока 1
        if (dropDownListPlayer1) {
          observer.fire('newPlayers',
            [{ nick: nickNamePlayer2, score: 0 }]);
          observer.fire('currentPlayersPair', [
            { nick: nickNamePlayer1, symbol: this.chosenSymbolPlayer1, currentScore: 0 },
            { nick: nickNamePlayer2, symbol: this.chosenSymbolPlayer2, currentScore: 0 }]);

          this.runPlay();

          // если уже есть выпадающий список у Игрока 2
        } else if (dropDownListPlayer2) {
          observer.fire('newPlayers',
            [{ nick: nickNamePlayer1, score: 0 }]);
          observer.fire('currentPlayersPair', [
            { nick: nickNamePlayer1, symbol: this.chosenSymbolPlayer1, currentScore: 0 },
            { nick: nickNamePlayer2, symbol: this.chosenSymbolPlayer2, currentScore: 0 }]);

          this.runPlay();

        // если Игрок 1 уже существует в базе, то заменяем его форму ввода на выпадающий список для выбора и подтверждения среди существующих игроков в базе
        } else if (player1) {
          this.notificationPlace.innerText = `Player 1 with nickname ${nickNamePlayer1} has been existed` +
            ' If this is your nick - please choose them or create a new one';

          // TODO: удалить!
          inputPlayer2.classList.add('new-player-2');
          this.setupListeners();

          this.createDropDownList('player-1', nickNamePlayer1);

        // если Игрок 2 уже существует в базе
        } else if (player2) {
          this.notificationPlace.innerText = `Player 2 with nickname ${nickNamePlayer2} has been existed` +
            ' If this is your nick - please choose them or create a new one';

          inputPlayer2.classList.add('new-player-1');
          this.setupListeners();

          this.createDropDownList('player-2', nickNamePlayer2);
        }

      // если оба игрока новые
      } else if (!player1 && !player2) {
        observer.fire('newPlayers', [
          { nick: nickNamePlayer1, score: 0 },
          { nick: nickNamePlayer2, score: 0 }]);
        observer.fire('currentPlayersPair', [
          { nick: nickNamePlayer1, symbol: this.chosenSymbolPlayer1, currentScore: 0 },
          { nick: nickNamePlayer2, symbol: this.chosenSymbolPlayer2, currentScore: 0 }]);

        this.runPlay();
      }

    // если оба поля ввода пустые
    } else if (!nickNamePlayer1 && !nickNamePlayer2) {
      this.notificationPlace.innerText = 'Please enter your nicknames in the form below';

    // если поле ввода Игрока 1 пустое
    } else if (!nickNamePlayer1) {
      this.notificationPlace.innerText = 'Player1 enter your nickname';

    // если поле Игрока 2 пустое
    } else if (!nickNamePlayer2) {
      this.notificationPlace.innerText = 'Player2 enter your nickname';
    }
  }

  // выводим сообщение каким символом играет Игрок 2. (зависит от выбора Игрока 1)
  toggleSecondPlayerSymbolMessage(symbol) {
    if (symbol === 'x') {
      this.seconsPlayerSymbolMessageArea.innerText = 'Your symbol is "O"';
    } else if (symbol === 'o') {
      this.seconsPlayerSymbolMessageArea.innerText = 'Your symbol is "X"';
    }
  }

  // заменяем форму ввода на выпадающий список с существующими игроками
  createDropDownList(playerOrder, playerName) {
    const anchor = document.querySelector(`.${playerOrder}`);

    const oldChild = document.getElementById(`${playerOrder}-nickname`);
    const select = document.createElement('select');
    anchor.replaceChild(select, oldChild);
    select.className = `create-game__main-form-player-drop-down-nicknames-${playerOrder}`;
    select.id = `${playerOrder}-nickname`;

    const anchorForSelect = document.querySelector(`.create-game__main-form-player-drop-down-nicknames-${playerOrder}`);

    this.model.model.forEach((item) => {
      const option = document.createElement('option');
      option.innerText = `${item.nick}`;
      option.setAttribute('value', item.nick);
      if (item.nick === playerName) {
        option.setAttribute('selected', '');
      }
      anchorForSelect.appendChild(option);
    });
  }
}
