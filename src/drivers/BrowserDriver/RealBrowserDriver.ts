import type { IBrowserDriver } from "./IBrowserDriver";

import { IsBrowser } from "./IsBrowser.ts";

const pixelMicro: string = IsBrowser() ?
   (await import("../../assets/fonts/PixelMicro.ttf")).default :
   "";

export class RealBrowserDriver implements IBrowserDriver {
   public WithWindow = <T>(callback: (window: Window) => T): T => {
      // eslint-disable-next-line no-undef
      return callback(window);
   };

   public Alert = (message: string): void => {
      // eslint-disable-next-line no-undef
      window.alert(message);
   };

   /**
    * This does actually not even use window.onload.
    * Assumably Vite uses window.onload (??) but if I would move to some other bundler I may have to
    * change this.
    */
   // eslint-disable-next-line no-undef
   public OnLoad(callback: () => unknown){
      // console.log("BrowserDriver.OnLoad");
      /**
       * I added some code to make sure thta PixelMicro font has loaded.
       */
      /* eslint-disable no-undef */
      const font = new FontFace("PixelMicro", `url("${pixelMicro}")`);

      font.load()
         .then(() => {
            // console.log("BrowserDriver.OnLoad: font.load.then");
            //@ts-ignore: typescript does not understand that `add` exists??
            document.fonts.add(font); // eslint-disable-line
            // console.log("BrowserDriver.OnLoad: font.load.then: document.fonts.add(font)");
            callback();
            // window.onload = () => {
            //    console.log("window.onload triggered");
            //    callback();
            // };
         })
         .catch(() => {
            this.Alert("Failed to load PixelMicro font.");
            callback(); // start anyway, but will look like thit.
         });
      /* eslint-enable no-undef */
   }

   public PerformanceNow = (): number => {
      // eslint-disable-next-line no-undef
      return window.performance.now();
   };

   public SetInterval = (callback: () => void, ms: number): number => {
      // eslint-disable-next-line no-undef
      return window.setInterval(callback, ms);
   };

   public RequestAnimationFrame = (callback: (time: number) => void): number => {
      // eslint-disable-next-line no-undef
      return window.requestAnimationFrame(callback);
   };

   public FetchText = async (input: RequestInfo | URL): Promise<string> => {
      // eslint-disable-next-line no-undef
      const res = await window.fetch(input);
      return res.text();
   };

   public FetchBinary = async (input: RequestInfo | URL): Promise<Blob> => {
      // eslint-disable-next-line no-undef
      const res = await window.fetch(input);
      return res.blob();
   };

   public SaveFile = async (_path: string, _data: string) => {
      // noop
   };

   public ProcessExit = (_code: number) => {
      // NOOP for now.
   };
}
