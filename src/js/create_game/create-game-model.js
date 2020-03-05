import { storage } from '../store/store';


export default class CreateGameModel {
  constructor() {
    this.model = storage.list;
  }

  addUsersData(array) {
    array.map((item) => this.model.push[item]);
    storage.list = array;
  }

  addCurrentPlayersPair = (array) => {
    storage.currentPlayersPair = array;
  }
}
