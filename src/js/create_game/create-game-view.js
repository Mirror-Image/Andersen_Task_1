import LadderComponent from '../ladder/ladder-component';
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

    this.radioCollection = document.querySelectorAll('.create-game__main-form-player-radio-symbol');

    this.seconsPlayerSymbolMessageArea = document.getElementById('second_player_symbol');

    this.notificationPlace = document.querySelector('.create-game__main-notification');
    this.joinGameButton = document.querySelector('.create-game__main-form-buttons-new-game');
    this.ladderButton = document.querySelector('.create-game__main-form-buttons-ladder');

    this.chosenSymbolPlayer1 = 'x';
    this.chosenSymbolPlayer2 = 'o';

    // создаем масив с существующими игроками (для простоты работы в дальнейшем)
    this.nickNamesArray = this.model.map((item) => item.nick);

    this.messageIsTypingNameAvailable = this.messageIsTypingNameAvailable.bind(this);
    this.checkSymbolPlayer1 = this.checkSymbolPlayer1.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.ladderLoader = this.ladderLoader.bind(this);


    this.init();
  }

  init() {
    // console.log('Create game component initialized');
    this.setupListeners();
  }

  setupListeners() {
    const playerInputCollection = document.querySelectorAll('.create-game__main-form-player-nickname');

    playerInputCollection.forEach((item) => {
      item.addEventListener('keyup', this.messageIsTypingNameAvailable);
    });

    this.radioCollection.forEach((radio) => radio.addEventListener('click', this.checkSymbolPlayer1));

    this.joinGameButton.addEventListener('click', this.handleJoinGame);
    this.ladderButton.addEventListener('click', this.ladderLoader);
  }

  ladderLoader() {
    /* eslint-disable no-new */
    this.anchor.innerHTML = '';
    new LadderComponent({
      GameView: CreateGameView,
    });
  }

  messageIsTypingNameAvailable(event) {
    const messageWindow = event.target.nextElementSibling.firstElementChild;
    let name = false;
    event.target.value.trim() !== '' ? name = event.target.value.trim()
      : messageWindow.innerText = 'Please enter a correct nickname';

    if (name) {
      if (this.isNameInStorage(this.nickNamesArray, name)) {
        messageWindow.innerText = 'This name has already exist';
      } else {
        messageWindow.innerText = 'This name is available';
      }
    }
  }

  // возвращает значение true или false
  isNameInStorage = (storage, name) => (storage.indexOf(name) !== -1);

  // определяем каким символом играет Игрок 1
  checkSymbolPlayer1(e) {
    this.toggleSecondPlayerSymbolMessage(e.target.value);
    this.chosenSymbolPlayer1 = e.target.value;
    this.checkSymbolPlayer2(e.target.value);
  }

  // выводим сообщение каким символом играет Игрок 2. (зависит от выбора Игрока 1)
  toggleSecondPlayerSymbolMessage(symbol) {
    this.seconsPlayerSymbolMessageArea.innerText = `Your symbol is ${symbol === 'x' ? '"O"' : '"X"'}`;
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
  }

  /* eslint-disable  class-methods-use-this */
  isInputValue(inputNode) {
    return inputNode.value.trim() === '' ? false : inputNode.value.trim();
  }

  handleFire(firstPlayerNick, secondPlayerNick, isPlayerNew) {
    if (isPlayerNew) {
      observer.fire('newPlayers',
        /* eslint-disable no-nested-ternary */
        firstPlayerNick && secondPlayerNick
          ? [{ nick: firstPlayerNick, score: 0 }, { nick: secondPlayerNick, score: 0 }]
          : firstPlayerNick
            ? [{ nick: firstPlayerNick, score: 0 }]
            : [{ nick: secondPlayerNick, score: 0 }]);
    }

    observer.fire('currentPlayersPair', [
      { nick: firstPlayerNick, symbol: this.chosenSymbolPlayer1, score: 0 },
      { nick: secondPlayerNick, symbol: this.chosenSymbolPlayer2, score: 0 }]);
  }

  // Вся логика системы входа в игру
  handleJoinGame(event) {
    event.preventDefault();

    const inputPlayer1 = document.getElementById('player-1-nickname');
    const inputPlayer2 = document.getElementById('player-2-nickname');

    const nickNamePlayer1 = this.isInputValue(inputPlayer1);
    const nickNamePlayer2 = this.isInputValue(inputPlayer2);

    const dropDownListPlayer1 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-1');
    const dropDownListPlayer2 = document.querySelector('.create-game__main-form-player-drop-down-nicknames-player-2');

    // проверка введенных имен в существующей базе данных (true/false)
    const player1 = this.isNameInStorage(this.nickNamesArray, nickNamePlayer1);
    const player2 = this.isNameInStorage(this.nickNamesArray, nickNamePlayer2);

    // если поля ввода имен игроков не пустые
    if (nickNamePlayer1 && nickNamePlayer2) {
      if (nickNamePlayer1 === nickNamePlayer2) {
        this.notificationPlace.innerText = 'You both are trying to enter the same nicknames. '
          + 'Please enter the different ones';

        // если оба игрока уже есть в базе
      } else if (player1 && player2) {
        // если у нас уже активны выпадающие списки с выбором уже существующих в базе игроков
        if (dropDownListPlayer1 && dropDownListPlayer2) {
          this.handleFire(nickNamePlayer1, nickNamePlayer2, false);
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
        // если уже есть выпадающий список
        if (dropDownListPlayer1 || dropDownListPlayer2) {
          this.handleFire(nickNamePlayer1, nickNamePlayer2, true);
          this.runPlay();
        } else if (player1 || player2) {
          this.notificationPlace.innerText = `Player with nickname ${player1 ? nickNamePlayer1 : nickNamePlayer2} has been existed`
            + ' If this is your nick - please choose it or create a new one';

          this.setupListeners();

          this.createDropDownList(player1 ? 'player-1' : 'player-2', player1 ? nickNamePlayer1 : nickNamePlayer2);
        }

      // если оба игрока новые
      } else if (!player1 && !player2) {
        this.handleFire(nickNamePlayer1, nickNamePlayer2, true);
        this.runPlay();
      }

    // если поля ввода пустые
    } else if (!nickNamePlayer1 || !nickNamePlayer2) {
      /* eslint-disable no-nested-ternary */
      !nickNamePlayer1 && !nickNamePlayer2
        ? this.notificationPlace.innerText = 'Please enter your nicknames in the form below'
        : !nickNamePlayer1
          ? this.notificationPlace.innerText = 'Player1 enter your nickname'
          : this.notificationPlace.innerText = 'Player2 enter your nickname';
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

    this.model.forEach((item) => {
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
