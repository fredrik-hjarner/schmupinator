import type { IDestroyable } from "../../../../utils/types/IDestroyable";

import { zIndices } from "../../../../consts";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { px } from "../../../../utils/px";
import { fontSizes } from "../../UI/Scenes/consts/fontSizes";

type TConstructorParams = {
   text: string,
   onClick?: () => void;
   fontSize?: number;
   left?: number,
   top?: number,
   padding?: string,
}

export class Button implements IDestroyable {
   private element: HTMLButtonElement;

   public constructor(params: TConstructorParams) {
      const {
         text, onClick=null, fontSize=fontSizes.smallest, left=0, top=0, padding="3px 5px"
      } = params;

      this.element = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("button");

         element.style.position = "fixed";
         element.style.top = px(top);
         element.style.left = px(left);
         element.style.fontSize = px(fontSize);
         element.style.whiteSpace = "pre";
         element.style.padding = padding;
         element.style.zIndex = zIndices.ui;
         element.innerHTML = text;
         element.onclick = onClick;

         window.document.body.appendChild(element);
            
         return element;
      }) as HTMLButtonElement;
   }

   public destroy = () => {
      this.element.remove();
   };
}
