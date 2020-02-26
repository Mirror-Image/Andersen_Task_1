import {localStore} from "./local-storage-component.js";


class Store {
  constructor() {
    this.init();
  }

  init() {
    console.log('Store component initialized');
    this.checkLocalStoreData();
  }

  checkLocalStoreData() {
    let data = localStore.getData();

    if (data) {
      this._list = data;
    } else {
      this._list = [];
    }
  }

  set list(array) {
    this._list = [...this._list, ...array];
    localStore.setData(this._list);
  }

  get list() {
    return this._list;
  }
}

export let storage = new Store();