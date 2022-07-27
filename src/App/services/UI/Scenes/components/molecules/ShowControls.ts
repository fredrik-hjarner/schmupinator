import { List } from "./List";

type TConstructor = {
   top?: number;
}

export class ShowControls {
   // vars
   private top: number;

   // elements
   private list?: List;

   public constructor(params: TConstructor) {
      this.top = params.top ?? 0;
   }

   public render() {
      this.list = new List({
         top: this.top,
         items: [
            { text: `move - arrow keys` },
            { text: `shoot - space` },
            { text: `laser - ctrl` },
            { text: `start - enter` }
         ]
      });
      this.list.render();
   }

   public destroy() {
      this.list?.destroy();
   }
}
