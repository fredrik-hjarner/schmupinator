import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";

BrowserDriver.OnLoad(() => {
   new Worker(new URL("./workerThread.ts", import.meta.url), {
      type: "module",
   });
});
