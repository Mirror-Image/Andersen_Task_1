import {observer} from "../store/observer.js";


export default class PlayGameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    observer.subscribe('playerStep', this.playerStep.bind(this));
    observer.subscribe('winnerFound', this.winnerFound.bind(this));
    observer.subscribe('messageNoWinner', this.messageNoWinner.bind(this));
    observer.subscribe('messageNextStep', this.messageNextStep.bind(this));
  }

  playerStep([data, player]) {
    console.log( data, player );
    this.model.bindPlayerStep([data, player]);
  }

  messageNoWinner() {
    this.view.bindMessageNoWinner();
  }

  messageNextStep() {
    this.view.bindMessageNextPlayer();
  }

  winnerFound() {
    this.view.bindWinnerFound();
    this.view.bindMessageWinner();
  }
}