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
   onMouseEnter?: HTMLDivElement["onmouseenter"];
   onMouseLeave?: HTMLDivElement["onmouseleave"];
}

export const createText = (params: TCreateTextParams) => {
   const {
      text, fontSize=16, left, top, right, className="", color="red", onClick=null,
      onMouseEnter=null, onMouseLeave=null
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
      // TODO: Should prolly be something else than innerHTML such as content or text...
      element.innerHTML = text;
      element.className = className;
      element.onclick = onClick;
      element.onmouseenter = onMouseEnter;
      element.onmouseleave = onMouseLeave;

      window.document.body.appendChild(element);
      
      return element;
   }) as HTMLDivElement;
};