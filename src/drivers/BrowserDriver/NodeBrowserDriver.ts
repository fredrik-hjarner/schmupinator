/* eslint-disable import/no-nodejs-modules */
import { IBrowserDriver } from "./IBrowserDriver";

export class NodeBrowserDriver implements IBrowserDriver {
   public WithWindow = (_: (window: Window) => unknown): void => {
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
      const buffer = await readFile(path);
      return buffer;
   };
}
