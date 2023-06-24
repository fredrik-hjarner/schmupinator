import { parallelAll, wait } from "../utils";
import { col } from "./common";

export const stage2 = {
   name: "stage2",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: "spawn", enemy: "cloner", x: col[5], y: -20 },
      wait(270),
      { type: "spawn", enemy: "cloner", x: col[2], y: -20 },
      { type: "spawn", enemy: "cloner", x: col[8], y: -20 },
   ]
};

export const cloner = {
   name: "cloner",
   hp: 25,
   diameter: 29,
   actions: [
      { moveToAbsolute: { y: 45 }, frames: 150 },
      wait(30),
      { type: "spawn", enemy: "clonerChild" },
      { type: "spawn", enemy: "clonerChild", actions: [
         { type: "setAttribute", attribute: "mirrorX", value: true }
      ] },
      wait(80),
      { type: "spawn", enemy: "clonerChild", actions: [
         { type: "setAttribute", attribute: "mirrorY", value: true }
      ] },
      { type: "spawn", enemy: "clonerChild", actions: [
         { type: "setAttribute", attribute: "mirrorX", value: true },
         { type: "setAttribute", attribute: "mirrorY", value: true }
      ]},
   ]
};

export const clonerChild = {
   name: "clonerChild",
   hp: 10,
   diameter: 18,
   actions: [
      { attr: "mirrorX", is: true, yes: [{ type: "mirrorX", value: true }] },
      { attr: "mirrorY", is: true, yes: [{ type: "mirrorY", value: true }] },
      { setShotSpeed: 1.5 },
      parallelAll(
         { type: "move", x: -45, y: -20, frames: 65 },
         [
            wait(60),
            // @ts-ignore
            { forever: [
               { type: "shootDirection", x: 0, y: 1},
               wait(40)
            ]},
         ],
      )
   ]
};
