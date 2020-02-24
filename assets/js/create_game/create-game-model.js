import {storage} from "../store/store.js";


export default class CreateGameModel {
  constructor() {
    this.model = storage.list;
  }

  addUsersData(array) {
    this.model.push(array[0], array[1]);
    storage.list = array;
    console.log( this.model );
  }
}