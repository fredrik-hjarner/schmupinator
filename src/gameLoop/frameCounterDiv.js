import { resolutionHeight } from "../consts.js";
import { px } from "../utils/px.js";

export const initFrameCounterDiv = () => {
  const frameCounter: HTMLDivElement = window.document.querySelector("#frameCounter");
  frameCounter.style.position = "fixed";
  frameCounter.style.top = px(resolutionHeight);
  frameCounter.style.left = "0px";
  return frameCounter;
};