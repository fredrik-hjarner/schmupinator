import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./utils/shade";
import { createText } from "./utils/text";

type TConstructor = {
   ui: UI;
}

export class Highscore implements IScene {
   readonly ui: UI;
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private top10?: HTMLDivElement;

   constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   private getTop10Text = (): string => {
      const header = `Rank\t\t\tScore\t\t\tPlayer`;
      const top10 = this.ui.highscoreService.getTop10()
         .map(({ name, score }, i) => `${i+1}\t\t\t\t${score}\t\t\t\t${name}`);
      return [header, ...top10].join("\n");
   };

   public render() {
      this.shadeElement = createShade();
      this.title = createText({text: "Highscore", fontSize: 24, top: 10, left: 128 });
      this.top10 = createText({
         text: this.getTop10Text(), fontSize: 15, top: 40, left: 40
      });
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.top10?.remove();
      this.top10 = undefined;
   }
}
