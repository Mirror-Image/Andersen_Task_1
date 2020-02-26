import {storage} from "../store/store.js";


export default class CreateGameModel {
  constructor() {
    this.model = storage.list;
  }

  addUsersData(array) {
    array.map(item => this.model.push[item]);
    storage.list = array;
    console.log( this.model );
  }
}