import { resolutionHeight } from "../../../consts";
import { px } from "../../../utils/px";

export const initFpsDiv = () => {
  const fpsDiv: HTMLDivElement = window.document.querySelector("#fpsDiv");
  fpsDiv.style.position = "fixed";
  fpsDiv.style.top = px(resolutionHeight + 40);
  fpsDiv.style.left = "0px";
  return fpsDiv;
};