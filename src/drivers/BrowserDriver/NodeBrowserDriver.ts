/* eslint-disable import/no-nodejs-modules */
// import { performance } from "perf_hooks"; // only uncomment when run in node for extra precision

import type { IBrowserDriver } from "./IBrowserDriver";

export class NodeBrowserDriver implements IBrowserDriver {
   public WithWindow = <T>(_: (window: Window) => T): undefined => {
      // noop. Don't execute whatever is in the callback.
      return undefined;
   };

   public Alert = (message: string): void => {
      console.log(message);
      throw new Error(message);
   };

   public OnLoad(callback: () => unknown){
      // run immediately.
      callback();
   }

   public PerformanceNow = (): number => {
      // return performance.now(); // only uncomment when running in node for extra precision.
      return Date.now(); // uncomment when code is supposed to run in browser.
   };

   public SetInterval = (callback: () => void, _: number): number => {
      for(let i=0; i<10_000_000; i++) {
         callback();
      }
      return 0;
   };

   // This implementation is actually pretty bad, but I don't use it anyway?
   public RequestAnimationFrame = (callback: (time: number) => void): number => {
      for(let i=0; i<10_000_000; i++) {
         callback(0);
      }
      return 0;
   };

   public FetchText = async (path: string): Promise<string> => {
      const { readFile } = await import("node:fs/promises");
      const buffer = await readFile(path);
      return buffer.toString();
   };

   // eslint-disable-next-line no-undef
   public FetchBinary = async (path: string): Promise<Buffer> => {
      const { readFile } = await import("node:fs/promises");
      let buffer;
      try {
         buffer = await readFile(path);
      }
      catch(err) {
         /**
          * Adding "." to the url is a hack to get vite-node to find files in the "."
          * folder, instead of /src on root. Problem with v. 16.0.0.
          * TODO: Maybe a later version of vite-node fixes this.
          */
         buffer = await readFile("." + path);
      }
      return buffer;
   };

   public SaveFile = async (path: string, data: string) => {
      const { writeFile } = await import("node:fs");
      writeFile(path, data, (err: Error | null) => {
         if(err) {
            throw err;
         }
         console.log("File saved.");
      });
   };
}
