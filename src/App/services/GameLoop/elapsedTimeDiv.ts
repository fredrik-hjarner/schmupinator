import { resolutionHeight } from "../../../consts.js";
import { px } from "../../../utils/px.js";

export const initElapsedTimeDiv = () => {
  const elapsedTimeDiv: HTMLDivElement = window.document.querySelector("#elapsedTimeDiv");
  elapsedTimeDiv.style.position = "fixed";
  elapsedTimeDiv.style.top = px(resolutionHeight + 20);
  elapsedTimeDiv.style.left = "0px";
  return elapsedTimeDiv;
};