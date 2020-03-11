import { observer } from '../store/observer';
import CreateGameModel from './create-game-model';


export default class CreateGameController {
  static onInit() {
    observer.subscribe('newPlayers', CreateGameController.addPlayers);
    observer.subscribe('currentPlayersPair', CreateGameController.addCurrentPlayersPair);
  }

  static addPlayers(array) {
    CreateGameModel.addUsersData(array);
  }

  static addCurrentPlayersPair(array) {
    CreateGameModel.addCurrentPlayersPair(array);
  }
}
