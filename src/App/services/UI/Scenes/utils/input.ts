import { zIndices } from "../../../../../consts";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { px } from "../../../../../utils/px";

type TCreateInputParams = {
   placeholder: string,
   fontSize?: number;
   left?: number,
   top?: number
}

export const createInput = (params: TCreateInputParams) => {
   const { placeholder, fontSize=16, left=0, top=0 } = params;

   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("input");

      element.type = "text";
      element.size = 10;
      element.placeholder = placeholder;
      element.style.position = "fixed";
      element.style.top = px(top);
      element.style.left = px(left);
      element.style.fontSize = px(fontSize);
      element.style.whiteSpace = "pre";
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);
      
      return element;
   }) as HTMLInputElement;
};