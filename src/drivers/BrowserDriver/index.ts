import { IsBrowser } from "./IsBrowser.ts";
import { NodeBrowserDriver } from "./NodeBrowserDriver.ts";
import { RealBrowserDriver } from "./RealBrowserDriver.ts";

export const BrowserDriver = IsBrowser() ? new RealBrowserDriver() : new NodeBrowserDriver();