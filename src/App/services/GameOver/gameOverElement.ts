import { px } from "../../../utils/px";

export const initGameOverElement = () => {
   const element: HTMLDivElement =
    window.document.querySelector("#gameOverDiv") as HTMLDivElement;
   element.style.position = "fixed";
   element.style.top = px(0);
   element.style.left = px(0);
   element.style.color = "white";
   element.style.fontSize = px(16);
   element.style.zIndex = "2"; // on toppest.
   return element;
};