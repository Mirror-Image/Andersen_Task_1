import '../styles/style.scss';

import CreateGameModel from './create_game/create-game-model';
import CreateGameView from './create_game/create-game-view';
import CreateGameController from './create_game/create-game-controller';

CreateGameModel.init();

const view = new CreateGameView(CreateGameModel.model);
/* eslint-disable no-new */
CreateGameController.onInit(view);
