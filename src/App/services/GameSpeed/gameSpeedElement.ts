import { resolutionHeight, resolutionWidth } from "../../../consts";
import { px } from "../../../utils/px";

export const initGameSpeedElement = () => {
   const element: HTMLInputElement =
    window.document.querySelector("#speedUp") as HTMLInputElement;
   element.style.position = "fixed";
   element.style.top = px(resolutionHeight);
   element.style.right = px(resolutionWidth);
   return element;
};