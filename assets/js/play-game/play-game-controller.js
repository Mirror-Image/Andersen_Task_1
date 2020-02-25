import {observer} from "../store/observer.js";


export default class PlayGameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    observer.subscribe('playerStep', this.playerStep.bind(this));
    observer.subscribe('winnerFound', this.winnerFound.bind(this));
  }

  playerStep(data, player) {
    this.model.bindPlayerStep(data, player);
  }

  winnerFound() {
    this.view.bindWinnerFound();
  }
}