import { storage } from '../store/store';
import { observer } from '../store/observer';
import CreateGameModel from '../create_game/create-game-model';
import CreateGameController from '../create_game/create-game-controller';


export default class LadderComponent {
  static GameViewConstructor() {}

  constructor({ GameView }) {
    LadderComponent.GameViewConstructor = GameView;
    this.anchor = document.querySelector('.app');
    this.model = storage.list;

    this.data = {
      type: 'table',
      class: 'ladder__table',
      text: null,
      children: [
        {
          type: 'thead',
          class: null,
          text: null,
          children: {
            type: 'tr',
            class: null,
            text: null,
            children: [
              {
                type: 'th',
                class: null,
                text: 'Nickname',
                children: null,
              },
              {
                type: 'th',
                class: null,
                text: 'Score',
                children: null,
              },
            ],
          },
        },
        {
          type: 'tbody',
          class: null,
          text: null,
          children: [],
        },
      ],
    };

    this.init();
  }

  createTableData(model) {
  /* eslint-disable prefer-destructuring */
    const data = this.data;

    model.forEach((item) => {
      data.children[1].children.push({
        type: 'tr',
        class: null,
        text: null,
        children: [
          {
            type: 'td',
            class: null,
            text: item.nick,
            children: null,
          },
          {
            type: 'td',
            class: null,
            text: item.score,
            children: null,
          },
        ],
      });
    });

    this.data = data;
  }

  init() {
    this.createTableData(this.model);
    this.anchor.appendChild(this.recursiveRender(this.data));
    this.renderButton();
    this.setupListeners();
  }

  recursiveRender = (node) => {
    const elem = document.createElement(node.type);
    node.class && elem.classList.add(node.class);
    if (node.text !== null) {
      elem.innerText = node.text;
    }

    if (!node.children) return elem;

    if (Array.isArray(node.children)) {
      const tempNodes = node.children.map(this.recursiveRender);
      tempNodes.forEach((current) => elem.appendChild(current));

      return elem;
    }

    const tempNode = this.recursiveRender(node.children);

    elem.appendChild(tempNode);

    return elem;
  };

  renderButton() {
    const returnButton = document.createElement('a');
    returnButton.className = 'ladder__return-button';
    returnButton.innerText = 'Return';

    this.anchor.appendChild(returnButton);
  }

  setupListeners() {
    const returnButton = document.querySelector('.ladder__return-button');
    observer.subscribe('returnToMainPage', this.handleReturn.bind(this));

    returnButton.addEventListener('click',
      () => observer.fire('returnToMainPage'));
  }

  handleReturn() {
    observer.unsubscribe('returnToMainPage', this.handleReturn.bind(this));
    this.anchor.innerHTML = '';

    CreateGameModel.init();
    const view = new LadderComponent.GameViewConstructor(CreateGameModel.model);
    CreateGameController.onInit(view);
  }
}
