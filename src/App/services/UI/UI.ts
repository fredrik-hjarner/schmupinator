import type { App } from "../../App";
import type { IUI } from "./IUI";
import type { IScene } from "./Scenes/IScene";

import { StartGame } from "./Scenes/StartGame";

type TConstructor = {
   app: App;
   name: string
}

export class UI implements IUI {
   readonly app: App;
   readonly name: string;

   startGame: IScene;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.startGame = new StartGame();
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.startGame.render();
   };
}