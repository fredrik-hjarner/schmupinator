import { resolutionHeight, resolutionWidth, zIndices } from "../../../consts";
import { px } from "../../../utils/px";

export const initGameSpeedElement = () => {
   const element: HTMLInputElement =
      window.document.querySelector("#speedUp") as HTMLInputElement;
   element.style.position = "fixed";
   element.style.top = px(resolutionHeight);
   element.style.right = px(resolutionWidth);
   element.value = "1";
   element.style.zIndex = zIndices.controlsAndLogs;
   return element;
};