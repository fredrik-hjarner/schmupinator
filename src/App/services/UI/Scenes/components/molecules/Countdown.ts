import { zIndices } from "../../../../../../consts";
import { BrowserDriver } from "../../../../../../drivers/BrowserDriver";
import { px } from "../../../../../../utils/px";
import { fontSizes } from "../../consts/fontSizes";

type TCountdownConstructor = {
   secondsLeft: number;
   onDone: () => void;
   fontSize?: number;
   left?: number,
   top?: number,
   className?: string
}

export class Countdown {
   public element: HTMLDivElement;
   public interval: number;
   private secondsLeft: number;
   private onDone: () => void;

   public constructor(params: TCountdownConstructor) {
      const {
         secondsLeft, onDone, fontSize=fontSizes.smallest, left=0, top=0, className=""
      } = params;

      this.secondsLeft = secondsLeft;
      this.onDone = onDone;

      // TODO: Can't I use createText here instead to reduce code duplication !?
      this.element = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");

         element.style.position = "fixed";
         element.style.top = px(top);
         element.style.left = px(left);
         element.style.color = "red";
         element.style.fontSize = px(fontSize);
         element.style.whiteSpace = "pre";
         element.style.zIndex = zIndices.ui;
         element.innerHTML = `${secondsLeft}`;
         element.className = className;

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
