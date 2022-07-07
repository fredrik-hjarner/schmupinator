import { zIndices } from "../../../../../consts";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { px } from "../../../../../utils/px";

type TCreateTextParams = {
   text: string,
   fontSize?: number;
   left?: number,
   top?: number
}

export const createText = (params: TCreateTextParams) => {
   const { text, fontSize=16, left=0, top=0 } = params;

   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");

      element.style.position = "fixed";
      element.style.top = px(top);
      element.style.left = px(left);
      element.style.color = "white";
      element.style.fontSize = px(fontSize);
      element.style.whiteSpace = "pre";
      element.style.zIndex = zIndices.ui;
      element.innerHTML = text;

      window.document.body.appendChild(element);
      
      return element;
   }) as HTMLDivElement;
};