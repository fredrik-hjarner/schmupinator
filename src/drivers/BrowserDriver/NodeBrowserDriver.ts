/* eslint-disable import/no-nodejs-modules */
import { IBrowserDriver } from "./IBrowserDriver";

export class NodeBrowserDriver implements IBrowserDriver {
   public WithWindow = <T>(_: (window: Window) => T): void => {
      // noop. Don't execute whatever is in the callback.
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
      return Date.now();
   };

   public SetInterval = (callback: () => void, _: number): number => {
      for(let i=0; i<10_000_000; i++) {
         callback();
      }
      return 0;
   };

   public FetchText = async (path: string): Promise<string> => {
      const { readFile } = await import("fs/promises");
      const buffer = await readFile(path);
      return buffer.toString();
   };

   // eslint-disable-next-line no-undef
   public FetchBinary = async (path: string): Promise<Buffer> => {
      const { readFile } = await import("fs/promises");
      let buffer;
      try {
         buffer = await readFile(path);
      }
      catch(err) {
         /**
          * Adding "public" to the url is a hack to get vite-node to find files in the "public"
          * folder. Problem with v. 16.0.0.
          * TODO: Maybe a later version of vite-node fixes this.
          */
         buffer = await readFile("public" + path);
      }
      return buffer;
   };
}
