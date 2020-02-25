import {storage} from "../store/store.js";
import {observer} from "../store/observer.js";


export default class PlayGameModel {
  constructor() {
    this.model = storage.list;
    this.winCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],

      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],

      [1, 5, 9],
      [3, 5, 7]
    ];
    this.checkedCellsX = [];
    this.checkedCellsY = [];
    this.stepCounter = 0;
  }

  bindPlayerStep(data, player) {
    if (player === 'x') {
      this.checkedCellsX.push(data);
    } else if (player === 'x') {
      this.checkedCellsY.push(data);
    }
    if (this.checkedCellsX > 2 || this.checkedCellsY > 2 &&
    this.checkWin(this.checkedCellsX, data) ||
      this.checkWin(this.checkedCellsY, data)) {
        observer.fire('winnerFound')
    }


  }

  checkWin(array, lastCellNumber) {
    let combinationCount = 0;

    // отсекаем ненужные winCombinations
    this.winCombinations.map(item => {
      if (item.indexOf(lastCellNumber) !== -1) {
        // проверяем array на соответствие winCombination
        for (let i = 0; i < item.length; i++) {
          if (array.indexOf(item[i]) !== -1) {
            combinationCount++;
            // как только все 3 цыфры совпали, оповещаем программе об этом
            if (combinationCount === 3) {
              return true;
            }
          }
        }
        combinationCount = 0;
      }
    });
  }

  scoreIncrement(nickName) {

  }
}