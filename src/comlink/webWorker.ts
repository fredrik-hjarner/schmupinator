/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { wrap } from "comlink";

// wait for port message
const {
   windowPort
} = await new Promise<any>((resolve) => {
   onmessage = (ev) => {
      resolve(ev.data);
   };
});

const window = wrap<Window>(windowPort);

const result = await window.localStorage.getItem("__settings");
console.log("result:", result);

close();