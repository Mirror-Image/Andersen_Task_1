


export default class LocalStorageComponent {
  constructor() {
    if (LocalStorageComponent.instance) {
      return LocalStorageComponent.instance
    }
    LocalStorageComponent.instance = this;
  }

  set data(value) {
    localStorage.setItem('tic-tac-data', JSON.stringify(value));
  }
}