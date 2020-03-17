import { storage } from '../store/store';


export default class CreateGameModel {
  static model = [];

  static init() {
    CreateGameModel.model = storage.list;
  }

  static addUsersData(array) {
    array.forEach((item) => CreateGameModel.model.push[item]);
    storage.list = array;
  }

  static addCurrentPlayersPair(array) {
    storage.currentPlayersPair = array;
  }
}
