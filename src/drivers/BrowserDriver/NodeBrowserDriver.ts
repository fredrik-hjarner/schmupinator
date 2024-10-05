/* eslint-disable import/no-nodejs-modules */
import type { IBrowserDriver } from "./IBrowserDriver";

import { IsBrowser } from "./IsBrowser.ts";

/**
 * TODO: Side effects suck though.
 * I should create a separate Driver for Deno.
 */
let perf: { now: () => number } = Date; // Date.now as fallback.
if (!IsBrowser()) {
   if(typeof window === "undefined") { // NodeJS
      const node_perf = (await import("node:perf_hooks"))?.performance;
      if(node_perf) {
         perf = node_perf;
      }
   // eslint-disable-next-line no-undef
   } else if("Deno" in window) { // Deno
      // eslint-disable-next-line no-undef
      perf = performance;
   }
}

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
      return perf.now();
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
      catch(_) {
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

   public ProcessExit = (code: number) => {
      /**
       * TODO: Create a DenoBrowserDriver, and use Deno.exit() there instead.
       */
      if (typeof process !== "undefined") { // NodeJS
         // eslint-disable-next-line no-undef
         process.exit(code);
      } else { // Deno
         // @ts-ignore
         // eslint-disable-next-line
         Deno.exit(code);
      }
   };
}
