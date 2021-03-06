import { storage } from '../store/store';
import { observer } from '../store/observer';


export default class PlayGameModel {
  constructor() {
    this.model = storage.list;
    this.currentPlayers = storage.currentPlayersPair;
    this.winCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],

      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],

      [1, 5, 9],
      [3, 5, 7],
    ];
    this.checkedCellsX = [];
    this.checkedCellsO = [];
    this.stepCount = 0;
    this.combinationCount = 0;
  }

  bindPlayerStep([data, player]) {
    if (player === 'x') {
      this.checkedCellsX.push(data);
    } else if (player === 'o') {
      this.checkedCellsO.push(data);
    }

    const isWinnerX = this.checkWin(this.checkedCellsX, data);
    const isWinnerO = this.checkWin(this.checkedCellsO, data);

    const isPossibleToFindWinner = (this.checkedCellsX.length > 2
                                    || this.checkedCellsO.length > 2)
                                    && (isWinnerX || isWinnerO);

    if (isPossibleToFindWinner) {
      observer.fire('winnerFound', isWinnerX
        ? this.currentPlayers[0].nick
        : this.currentPlayers[1].nick);
    } else {
      this.stepCounter();
    }
  }

  stepCounter() {
    this.stepCount++;
    this.stepCount === 9
      ? observer.fire('messageNoWinner')
      : observer.fire('messageNextStep');
  }

  checkWin(array, lastCellNumber) {
    let result = false;

    // отсекаем ненужные winCombinations
    this.winCombinations.forEach((item) => {
      if (item.indexOf(lastCellNumber) !== -1) {
        // проверяем array на соответствие winCombination
        item.forEach((number) => {
          if (array.indexOf(number) !== -1) {
            this.combinationCount++;

            // как только все 3 цыфры совпали, оповещаем программе об этом
            if (this.combinationCount === 3) {
              this.combinationCount = 0;
              result = true;
            }
          }
        });

        /* for (let i = 0; i < item.length; i++) {
          if (array.indexOf(item[i]) !== -1) {
            this.combinationCount++;
            // как только все 3 цыфры совпали, оповещаем программе об этом
            if (this.combinationCount === 3) {
              this.combinationCount = 0;
              result = true;
            }
          }
        } */
        this.combinationCount = 0;
      }
    });

    return result;
  }

  scoreIncrement(nickName) {
    [this.currentPlayers, this.model].forEach((arrayData) => {
      arrayData.reduce((result, currentItem) => {
        if (currentItem.nick === nickName) {
          currentItem.score++; // eslint-disable-line no-param-reassign
        }
        return [...result, currentItem];
      }, []);
    });

    storage.updateList(this.model.sort((itemA, itemB) => itemB.score - itemA.score));
  }

  // test

  bindResetGame() {
    this.checkedCellsX = [];
    this.checkedCellsO = [];
    this.stepCount = 0;
    this.combinationCount = 0;
  }
}
