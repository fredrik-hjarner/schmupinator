import type { IScene } from "./IScene";
import type { App } from "../../../App";
import type { IUI } from "../IUI";

type TConstructor = {
   app: App;
   ui: IUI;
}

export class Game implements IScene {
   readonly app: App;
   readonly ui: IUI;

   constructor(params: TConstructor) {
      this.app = params.app;
      this.ui = params.ui;
   }

   public render() {
      // noop
   }

   public destroy() {
      // noop
   }
}
