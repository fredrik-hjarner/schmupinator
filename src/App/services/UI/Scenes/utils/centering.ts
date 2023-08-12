import { resolutionHeight, resolutionWidth } from "../../../../../consts.ts";
import { px } from "../../../../../utils/px.ts";

type TCenterable = {
   offsetWidth: number;
   offsetHeight: number;
   style: {
      top: string;
      left: string;
   }
}

/**
 * If have problems with offsetWidth then it's because of the font not having been loaded.
 * The font has to have been loaded first otherwise widths and height will be wrong.
 */
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
