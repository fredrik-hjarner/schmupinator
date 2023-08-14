/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TRunInMainThread } from "./mainThread";

import { wrap } from "comlink";

// wait for port message
const {
   runInMainThreadPort,
   windowPort
} = await new Promise<any>((resolve) => {
   onmessage = (ev) => {
      resolve(ev.data);
   };
});

const runInMainThread = wrap<TRunInMainThread>(runInMainThreadPort);
const window = wrap<Window>(windowPort);


const result = await runInMainThread(`
   return localStorage.getItem("__settings");
`);
console.log("result:", result);

const result2 = await window.localStorage.getItem("__settings");
console.log("result2:", result2);

close();