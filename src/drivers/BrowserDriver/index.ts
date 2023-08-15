import { GetEnvironment } from "./GetEnvironment.ts";
import { NodeBrowserDriver } from "./NodeBrowserDriver.ts";
import { RealBrowserDriver } from "./RealBrowserDriver.ts";

export const BrowserDriver = (() => {
   const env = GetEnvironment();
   switch(env) {
      case "webworker_deno":
      case "deno":
         return new NodeBrowserDriver();
      case "browser":
      case "webworker_browser":
         return new RealBrowserDriver();
      default:
         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
         throw new Error(`Unknown environment: ${env}`);
   }
})();
