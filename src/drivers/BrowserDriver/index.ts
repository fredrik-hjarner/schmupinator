import { NodeBrowserDriver } from "./NodeBrowserDriver";
import { RealBrowserDriver } from "./RealBrowserDriver";

export const IsBrowser = (): boolean => {
   const windowType = typeof window;
   const result = windowType !== "undefined";
   return result;
};

export const BrowserDriver = IsBrowser() ? new RealBrowserDriver() : new NodeBrowserDriver();