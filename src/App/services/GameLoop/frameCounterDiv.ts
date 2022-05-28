import { resolutionHeight } from "../../../consts";
import { px } from "../../../utils/px";

export const initFrameCounterDiv = () => {
  const frameCounter: HTMLDivElement = window.document.querySelector("#frameCounter");
  frameCounter.style.position = "fixed";
  frameCounter.style.top = px(resolutionHeight);
  frameCounter.style.left = "0px";
  return frameCounter;
};