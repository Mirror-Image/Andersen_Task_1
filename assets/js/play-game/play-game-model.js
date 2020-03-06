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
    this.checkedCellsO = [];
    this.stepCount = 0;
    this.combinationCount = 0
  }

  bindPlayerStep([data, player]) {
    if (player === 'x') {
      this.checkedCellsX.push(data);
      console.log(this.checkedCellsX);
    } else if (player === 'o') {
      this.checkedCellsO.push(data);
      console.log(this.checkedCellsO);
    }
    if ((this.checkedCellsX.length > 2 ||
      this.checkedCellsO.length > 2) &&
      (this.checkWin(this.checkedCellsX, data) ||
      this.checkWin(this.checkedCellsO, data))) {
        observer.fire('winnerFound');
    } else {
      this.stepCounter();
    }
  }

  stepCounter() {
    this.stepCount++;
    this.stepCount === 9 ?
      observer.fire('messageNoWinner') :
      observer.fire('messageNextStep');
  }

  checkWin(array, lastCellNumber) {
    let result = false;
    //TODO: optimize the code below using Array.filter / forEach

    // отсекаем ненужные winCombinations
    this.winCombinations.forEach(item => {
      if (item.indexOf(lastCellNumber) !== -1) {
        // проверяем array на соответствие winCombination
        console.log( item );
        for (let i = 0; i < item.length; i++) {
          if (array.indexOf(item[i]) !== -1) {
            this.combinationCount++;
            console.log( this.combinationCount);
            // как только все 3 цыфры совпали, оповещаем программе об этом
            if (this.combinationCount === 3) {
              this.combinationCount = 0;
              console.log('WINNER');
              result = true;
            }
          }
        }
        this.combinationCount = 0;
      }
    });
    return result;
  }

  scoreIncrement(nickName) {

  }
}