export class BrowserDriver {
   public static IsBrowser = (): boolean => {
      return typeof window !== undefined;
   };

   public static WithWindow = (callback: (window: Window) => unknown): unknown => {
      // eslint-disable-next-line no-undef
      return callback(window);
   };

   public static Alert = (message?: unknown): void => {
      // eslint-disable-next-line no-undef
      alert(message);
   };

   // eslint-disable-next-line no-undef
   public static set OnLoad(callback: typeof window.onload){
      // eslint-disable-next-line no-undef
      window.onload = callback;
   }

   public static PerformanceNow = (): number => {
      // eslint-disable-next-line no-undef
      return performance.now();
   };

   public static SetInterval = (callback: () => void, ms: number): number => {
      // eslint-disable-next-line no-undef
      return window.setInterval(callback, ms);
   };
}
