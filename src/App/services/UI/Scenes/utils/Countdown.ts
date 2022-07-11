import { zIndices } from "../../../../../consts";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { px } from "../../../../../utils/px";

type TCountdownConstructor = {
   secondsLeft: number;
   onDone: () => void;
   fontSize?: number;
   left?: number,
   top?: number
}

export class Countdown {
   private element: HTMLDivElement;
   public interval: number;
   private secondsLeft: number;
   private onDone: () => void;

   public constructor(params: TCountdownConstructor) {
      const { secondsLeft, onDone, fontSize=16, left=0, top=0 } = params;

      this.secondsLeft = secondsLeft;
      this.onDone = onDone;

      this.element = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");

         element.style.position = "fixed";
         element.style.top = px(top);
         element.style.left = px(left);
         element.style.color = "white";
         element.style.fontSize = px(fontSize);
         element.style.whiteSpace = "pre";
         element.style.zIndex = zIndices.ui;
         element.innerHTML = `${secondsLeft}`;

         window.document.body.appendChild(element);
      
         return element;
      }) as HTMLDivElement;

      this.interval = BrowserDriver.SetInterval(this.tick, 1000);
   }

   public destroy = () => {
      BrowserDriver.WithWindow(window => {
         window.clearInterval(this.interval);
      });
      this.element.remove();
   };

   private tick = () => {
      this.secondsLeft--;
      this.element.innerHTML = `${this.secondsLeft}`;
      if(this.secondsLeft < 1) {
         this.destroy();
         this.onDone();
      }
   };
}
