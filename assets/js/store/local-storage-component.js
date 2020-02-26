class LocalStorageComponent {
  constructor() {
    if (LocalStorageComponent.instance) {
      return LocalStorageComponent.instance
    }
    LocalStorageComponent.instance = this;
  }

  setData(array) {
    localStorage.setItem('tic-tac-data', JSON.stringify(array));
  }

  getData() {
    let res = localStorage.getItem('tic-tac-data');
    return JSON.parse(res);
  }

  /*setPlayersNamesData(array) {
    localStorage.setItem('players-name-data', JSON.stringify(array));
  }

  getPlayersNamesData() {
    let res = localStorage.getItem('players-name-data');
    return JSON.parse(res);
  }*/
  /*set currentPlayersPair(array) {
    localStorage.setItem('currentPlayerPair', JSON.stringify(array));
  }

  get currentPlayersPair() {
    let res = localStorage.getItem('currentPlayerPair');
    return JSON.parse(res);
  }*/
}

export let localStore = new LocalStorageComponent();