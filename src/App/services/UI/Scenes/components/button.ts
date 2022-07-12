import { zIndices } from "../../../../../consts";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { px } from "../../../../../utils/px";

type TCreateButtonParams = {
   text: string,
   onClick?: () => void;
   fontSize?: number;
   left?: number,
   top?: number,
   padding?: string,
}

export const createButton = (params: TCreateButtonParams) => {
   const { text, onClick=null, fontSize=16, left=0, top=0, padding="5px 10px" } = params;

   return BrowserDriver.WithWindow(window => {
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
};