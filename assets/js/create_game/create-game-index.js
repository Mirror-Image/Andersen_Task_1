import CreateGameModel from "./create-game-model.js";
import CreateGameView from "./create-game-view.js";
import CreateGameController from "./create-game-controller.js";

let model = new CreateGameModel();
let view = new CreateGameView(model);
export const createGameController = new CreateGameController(model, view);