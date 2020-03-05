import { localStore } from './local-storage-component';


class Store {
  constructor() {
    this.init();
  }

  init() {
    // console.log('Store component initialized');
    this.checkLocalStoreData();
  }

  checkLocalStoreData() {
    this._list = localStore.getData() || [];
  }

  updateList = (array) => {
    localStore.setData(array);
  };

  set list(array) {
    this._list = [...this._list, ...array];
    localStore.setData(this._list);
  }

  get list() {
    return this._list;
  }

  set currentPlayersPair(array) {
    if (array[0].symbol === 'o') {
      this._currentPlayersPair = array.reverse();
    } else {
      this._currentPlayersPair = array;
    }
  }

  get currentPlayersPair() {
    return this._currentPlayersPair;
  }
}

export const storage = new Store();
