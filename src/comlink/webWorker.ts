import type { TRunInMainThread } from "./mainThread";

import { wrap } from "comlink";

// wait for port message
const port = await new Promise<MessagePort>((resolve) => {
   onmessage = (ev) => {
      console.log("ev.ports.length:", ev.ports.length);
      resolve(ev.ports[0]);
   };
});

const runInMainThread = wrap<TRunInMainThread>(port);
await runInMainThread();
close();