import { resolutionHeight } from "../../../consts";
import { px } from "../../../utils/px";

export const initElapsedTimeDiv = () => {
  const elapsedTimeDiv: HTMLDivElement =
    window.document.querySelector("#elapsedTimeDiv") as HTMLDivElement;
  elapsedTimeDiv.style.position = "fixed";
  elapsedTimeDiv.style.top = px(resolutionHeight + 20);
  elapsedTimeDiv.style.left = "0px";
  return elapsedTimeDiv;
};