import { storage } from '../store/store';
import CreateGameModel from '../create_game/create-game-model';
import CreateGameController from '../create_game/create-game-controller';


export default class LadderComponent {
  static GameViewConstructor() {

  }

  constructor({ GameView }) {
    LadderComponent.GameViewConstructor = GameView;
    this.anchor = document.querySelector('.app');
    this.model = storage.list;

    this.init();
  }

  init() {
    this.render();
    this.setupListeners();
  }

  render() {
    const title = document.createElement('h1');
    title.className = 'ladder__title';
    title.innerText = 'Top Players';

    const table = document.createElement('table');
    table.className = 'ladder__table';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const tr = document.createElement('tr');

    const thNickName = document.createElement('th');
    thNickName.innerText = 'Nickname';
    const thScore = document.createElement('th');
    thScore.innerText = 'Score';

    const returnButton = document.createElement('a');
    returnButton.className = 'ladder__return-button';
    returnButton.innerText = 'Return';

    tr.appendChild(thNickName);
    tr.appendChild(thScore);
    thead.appendChild(tr);
    table.appendChild(thead);

    const sortedModel = this.model.sort((itemA, itemB) => itemB.score - itemA.score);

    sortedModel.forEach((item) => {
      const trItem = document.createElement('tr');

      const tdItemNickName = document.createElement('td');
      tdItemNickName.innerText = `${item.nick}`;

      const tdItemScore = document.createElement('td');
      tdItemScore.innerText = `${item.score}`;

      trItem.appendChild(tdItemNickName);
      trItem.appendChild(tdItemScore);
      tbody.appendChild(trItem);
    });

    table.appendChild(tbody).appendChild(returnButton);
    this.anchor.appendChild(title);
    this.anchor.appendChild(table);
    this.anchor.appendChild(returnButton);
  }

  setupListeners() {
    const returnButton = document.querySelector('.ladder__return-button');

    returnButton.addEventListener('click', this.handleReturn.bind(this));
  }

  handleReturn() {
    this.anchor.innerHTML = '';

    const model = new CreateGameModel();
    const view = new LadderComponent.GameViewConstructor(model);
    /* eslint-disable no-new */
    new CreateGameController(model, view);
  }
}
