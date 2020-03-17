import { observer } from '../store/observer';


export default class PlayGameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    observer.subscribe('playerStep', this.playerStep.bind(this));
    observer.subscribe('winnerFound', this.winnerFound.bind(this));
    observer.subscribe('messageNoWinner', this.messageNoWinner.bind(this));
    observer.subscribe('messageNextStep', this.messageNextStep.bind(this));
    observer.subscribe('resetGame', this.resetGame.bind(this));
  }

  playerStep([data, player]) {
    this.model.bindPlayerStep([data, player]);
  }

  messageNoWinner() {
    this.view.bindMessageNoWinner();
    this.view.bindRemoveListeners();
  }

  messageNextStep() {
    this.view.bindMessageNextPlayer();
  }

  winnerFound(winnerNick) {
    this.view.bindRemoveListeners();
    this.view.bindMessageWinner();
    this.model.scoreIncrement(winnerNick);
    this.view.scoreTable();
  }

  resetGame() {
    this.model.bindResetGame();
  }
}
