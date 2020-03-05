import '../styles/style.scss';

import CreateGameModel from './create_game/create-game-model';
import CreateGameView from './create_game/create-game-view';
import CreateGameController from './create_game/create-game-controller';

const model = new CreateGameModel();
const view = new CreateGameView(model);
/* eslint-disable no-new */
new CreateGameController(model, view);
