import { IBrowserDriver } from "./IBrowserDriver";

export class RealBrowserDriver implements IBrowserDriver {
   public WithWindow = <T>(callback: (window: Window) => T): T => {
      // eslint-disable-next-line no-undef
      return callback(window);
   };

   public Alert = (message: string): void => {
      // eslint-disable-next-line no-undef
      window.alert(message);
   };

   // eslint-disable-next-line no-undef
   public OnLoad(callback: () => unknown){
      // eslint-disable-next-line no-undef
      window.onload = callback;
   }

   public PerformanceNow = (): number => {
      // eslint-disable-next-line no-undef
      return window.performance.now();
   };

   public SetInterval = (callback: () => void, ms: number): number => {
      // eslint-disable-next-line no-undef
      return window.setInterval(callback, ms);
   };

   public FetchText = async (input: RequestInfo | URL): Promise<string> => {
      // eslint-disable-next-line no-undef
      const res = await window.fetch(input);
      return await res.text();
   };

   public FetchBinary = async (input: RequestInfo | URL): Promise<Blob> => {
      // eslint-disable-next-line no-undef
      const res = await window.fetch(input);
      return await res.blob();
   };
}
