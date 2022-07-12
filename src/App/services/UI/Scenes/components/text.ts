import { zIndices } from "../../../../../consts";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { px } from "../../../../../utils/px";

type TCreateTextParams = {
   text: string,
   fontSize?: number;
   top?: number,
   left?: number,
   right?: number,
}

export const createText = (params: TCreateTextParams) => {
   const { text, fontSize=16, left, top, right } = params;

   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");

      element.style.position = "fixed";
      if(top !== undefined) {
         element.style.top = px(top);
      }
      if(left !== undefined) {
         element.style.left = px(left);
      }
      if(right !== undefined) {
         element.style.right = px(right);
      }
      element.style.color = "white";
      element.style.fontSize = px(fontSize);
      // The line height of the PixelMicro font gets too "high".
      // element.style.lineHeight = px(fontSize*0.6);
      element.style.whiteSpace = "pre";
      element.style.zIndex = zIndices.ui;
      element.innerHTML = text;

      window.document.body.appendChild(element);
      
      return element;
   }) as HTMLDivElement;
};