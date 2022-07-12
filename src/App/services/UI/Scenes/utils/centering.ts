import { resolutionHeight, resolutionWidth } from "../../../../../consts";
import { px } from "../../../../../utils/px";

type TCenterable = {
   offsetWidth: number;
   offsetHeight: number;
   style: {
      top: string;
      left: string;
   }
}

export const centerHorizontally = (element: TCenterable): TCenterable => {
   const halfWidth = element.offsetWidth/2;
   element.style.left = px((resolutionWidth/2) - halfWidth);
   return element;
};

export const centerVertically = (element: TCenterable): TCenterable => {
   const halfHeight = element.offsetHeight/2;
   element.style.top = px((resolutionHeight/2) - halfHeight);
   return element;
};

export const center = (element: TCenterable): TCenterable => {
   centerHorizontally(element);
   centerVertically(element);
   return element;
};
