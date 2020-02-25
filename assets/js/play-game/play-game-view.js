import {observer} from "../store/observer.js";


export default class PlayGameView {
  constructor(model) {
    this.model = model;

    this.anchor = document.querySelector("body");
    this.templateElement = document.querySelector('.play-game')
      .content.cloneNode(true);
    this.anchor.innerHTML = '';
    this.anchor.appendChild(this.templateElement);
    this.cells = document.querySelectorAll('td');

    this.newGameButton = document.querySelector('.play-game__main-new-game-button');

    this.PlayerSymbol = 'x';
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

    event.target.innerText = this.PlayerSymbol;

    observer.fire('playerStep', clickedCellData, this.PlayerSymbol);
  }

  bindWinnerFound() {
    this.cells.forEach(item =>
    item.removeEventListener('click', this.handleSteps.bind(this)));
  }
}