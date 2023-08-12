import type { IInput } from "../../../../Input/IInput";

import { zIndices } from "../../../../../../consts.ts";
import { BrowserDriver } from "../../../../../../drivers/BrowserDriver/index.ts";
import { px } from "../../../../../../utils/px.ts";
import { fontSizes } from "../../consts/fontSizes.ts";

type TCountdownConstructor = {
   input: IInput;

   secondsLeft: number;
   onDone: () => void;
   fontSize?: number;
   left?: number,
   top?: number,
   className?: string
}

export class Countdown {
   // vars
   public interval: number;
   // secondsLeft that was sent in via construcor.
   private originalSecondsLeft: number;
   private currentSecondsLeft: number;
   private onDone: () => void;

   // deps/services
   private input: IInput;

   // elements
   public element: HTMLDivElement;

   public constructor(params: TCountdownConstructor) {
      const {
         input, secondsLeft, onDone, fontSize=fontSizes.smallest, left=0, top=0, className=""
      } = params;

      this.input = input;

      this.originalSecondsLeft = secondsLeft;
      this.currentSecondsLeft = secondsLeft;
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
      })!;

      this.interval = BrowserDriver.SetInterval(this.tick, 1000);

      // register onKey callback.
      this.input.onKeyUpCallback = key => {
         switch(key) {
            case "laser":
            case "shoot":
            case "start":
               /**
                * Allows to "click past" this timeout to "advance"
                * so you dont have to wait for the timeout.
                * But have at least 1 second pass, otherwise player might accidentally skip scene.
                */
               if(this.originalSecondsLeft - this.currentSecondsLeft >= 1) {
                  this.destroy();
                  this.onDone();
               }
               break;
            default:
               // NOOP
         }
      };
   }

   public destroy = () => {
      // Must unregister the callback.
      this.input.onKeyUpCallback = undefined;

      BrowserDriver.WithWindow(window => {
         window.clearInterval(this.interval);
      });
      this.element.remove();
   };

   private tick = () => {
      this.currentSecondsLeft--;
      this.element.innerHTML = `${this.currentSecondsLeft}`;
      if(this.currentSecondsLeft < 1) {
         this.destroy();
         this.onDone();
      }
   };
}
