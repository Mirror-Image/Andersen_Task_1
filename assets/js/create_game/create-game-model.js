import {storage} from "../store/store.js";


export default class CreateGameModel {
  constructor() {
    this.model = storage.list;
    this.currentPlayers = [];
  }

  addUsersData(array) {
    array.map(item => this.model.push[item]);
    storage.list = array;
    console.log( this.model );
  }

  addCurrentPlayersPair(array) {
    this.currentPlayers = array;
    console.log( this.currentPlayers );
  }
}