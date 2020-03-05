class LocalStorageComponent {
  static setData(array) {
    localStorage.setItem('tic-tac-data', JSON.stringify(array));
  }

  static getData() {
    const res = localStorage.getItem('tic-tac-data');
    return JSON.parse(res);
  }
}

export const localStore = LocalStorageComponent;
