import { zIndices } from "../../../../../../consts.ts";
import { BrowserDriver } from "../../../../../../drivers/BrowserDriver/index.ts";
import { px } from "../../../../../../utils/px.ts";
import { fontSizes } from "../../consts/fontSizes.ts";

type TCreateInputParams = {
   placeholder: string,
   maxlength?: number
   fontSize?: number;
   left?: number,
   top?: number
}

export const createInput = (params: TCreateInputParams) => {
   const { placeholder, maxlength=6, fontSize=fontSizes.smallest, left=0, top=0 } = params;

   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("input");

      element.type = "text";
      element.size = 10;
      element.placeholder = placeholder;
      element.maxLength = maxlength;
      element.style.position = "fixed";
      element.style.top = px(top);
      element.style.left = px(left);
      element.style.fontSize = px(fontSize);
      element.style.whiteSpace = "pre";
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);
      
      return element;
   })!;
};