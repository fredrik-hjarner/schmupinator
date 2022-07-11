import type { IFullscreen } from "./IFullscreen";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { resolutionHeight, resolutionWidth } from "../../../consts";

type TConstructor = {
   name: string;
}

export class Fullscreen implements IFullscreen {
   name: string;
   private gameAspectRatio = resolutionWidth / resolutionHeight;

   constructor({ name }: TConstructor) {
      this.name = name;

      this.setFullscreen();
      // TODO: THis is never cleared !!!
      BrowserDriver.WithWindow(window => {
         window.addEventListener("resize", this.setFullscreen);
      });
   }

   Init = async () => {
      //
   };

   // TODO: This is never called because it is not on IFullscreen interface etc.
   destroy = () => {
      BrowserDriver.WithWindow(window => {
         window.removeEventListener("resize", this.setFullscreen);
      });
   };

   private setFullscreen = () => {
      BrowserDriver.WithWindow(window => {
         const body = window.document.body;
         const windowWidth = window.document.documentElement.clientWidth;
         const windowHeight = window.document.documentElement.clientHeight;
         const windowAspectRatio = windowWidth / windowHeight;
         if(windowAspectRatio > this.gameAspectRatio) {
            // will be extra space in x-wise
            const scale = windowHeight / resolutionHeight;
            let translateX = 0;
            translateX = (windowWidth - resolutionWidth*scale) / 2;
            body.style.transform = `translateX(${translateX}px) scale(${scale})`;
         } else {
            // will be extra space in y-wise
            const scale = windowWidth / resolutionWidth;
            body.style.transform = `scale(${scale})`;
         }
      });
   };
}
