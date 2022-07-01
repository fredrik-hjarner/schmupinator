import type { App } from "../../App";
import type { IUI } from "./IUI";
import type { IScene } from "./Scenes/IScene";

import { StartGame } from "./Scenes/StartGame";
import { Game } from "./Scenes/Game";
import { GameOver } from "./Scenes/GameOver";

type TConstructor = {
   app: App;
   name: string
}

export class UI implements IUI {
   readonly app: App;
   readonly name: string;

   startGame: IScene;
   game: IScene;
   gameOver: IScene;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.startGame = new StartGame({ app, ui: this });
      this.game = new Game({ app, ui: this });
      this.gameOver = new GameOver({ app, ui: this });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.startGame.render();
      // this.gameOver.render();
   };
}