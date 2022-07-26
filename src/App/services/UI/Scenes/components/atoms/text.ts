import { zIndices } from "../../../../../../consts";
import { BrowserDriver } from "../../../../../../drivers/BrowserDriver";
import { px } from "../../../../../../utils/px";

type TCreateTextParams = {
   text: string,
   fontSize?: number;
   top?: number,
   left?: number,
   right?: number,
   className?: string,
   color?: string,
   onClick?: () => void;
}

export const createText = (params: TCreateTextParams) => {
   const {
      text, fontSize=16, left, top, right, className="", color="red", onClick=null
   } = params;

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
      element.style.color = color;
      element.style.fontSize = px(fontSize);
      element.style.whiteSpace = "pre";
      element.style.zIndex = zIndices.ui;
      element.innerHTML = text;
      element.className = className;
      element.onclick = onClick;

      window.document.body.appendChild(element);
      
      return element;
   }) as HTMLDivElement;
};