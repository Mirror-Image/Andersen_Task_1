import {observer} from "../store/observer.js";


export default class CreateGameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    observer.subscribe('newPlayers', this.addPlayers.bind(this));
  }

  addPlayers(array) {
    this.model.addUsersData(array);
  }
}