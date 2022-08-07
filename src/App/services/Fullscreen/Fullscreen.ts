import type { IFullscreen } from "./IFullscreen";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { resolutionHeight, resolutionWidth } from "../../../consts";

type TConstructor = {
   name: string;
}

export class Fullscreen implements IFullscreen {
   public readonly name: string;
   private gameAspectRatio = resolutionWidth / resolutionHeight;

   public constructor({ name }: TConstructor) {
      this.name = name;

      this.setFullscreen();
      // TODO: THis is never cleared !!!
      BrowserDriver.WithWindow(window => {
         window.addEventListener("resize", this.setFullscreen);
      });
   }

   public Init = async () => {
      // noop
   };

   public destroy = () => {
      BrowserDriver.WithWindow(window => {
         window.removeEventListener("resize", this.setFullscreen);
         window.document.body.style.transform = "none";
         window.document.body.style.width = "100%";
         window.document.body.style.height = "100%";
      });
   };

   private setFullscreen = () => {
      BrowserDriver.WithWindow(window => {
         const body = window.document.body;
         const windowWidth = window.document.documentElement.clientWidth;
         const windowHeight = window.document.documentElement.clientHeight;
         const windowAspectRatio = windowWidth / windowHeight;
         let scale: number;
         if(windowAspectRatio > this.gameAspectRatio) {
            // will be extra space in x-wise
            scale = windowHeight / resolutionHeight;
            let translateX = 0;
            translateX = (windowWidth - resolutionWidth*scale) / 2;
            body.style.transform = `translateX(${translateX}px) scale(${scale})`;
         } else {
            // will be extra space in y-wise
            scale = windowWidth / resolutionWidth;
            body.style.transform = `scale(${scale})`;
         }
         /**
          * This width/height stuff is needed because for some reason on touch devices,
          * overflow: hidden does not work.
          */
         body.style.width = `${100* (1/scale)}%`;
         body.style.height = `${100* (1/scale)}%`;
      });
   };
}
