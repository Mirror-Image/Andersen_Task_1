class Store {
  constructor() {
    this.init();
  }

  init() {
    console.log('Store component initialized');
    this.checkLocalStoreData();
  }

  checkLocalStoreData() {
    let data = localStorage.getItem('tic-tac-data');

    if (data) {
      this._list = JSON.parse(data);
    } else {
      this._list = [];
    }
  }

  set list(array) {
    this._list = [...this._list, ...array];
    localStorage.setItem('tic-tac-data', JSON.stringify(this.list));
  }

  get list() {
    return this._list;
  }
}

export let storage = new Store();