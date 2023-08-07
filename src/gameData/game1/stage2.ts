import type { TGameObject } from "../../gameTypes/TGameObject";


import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import {
   attr, createGameObject, forever, moveToAbsolute, parallelAll, setShotSpeed, wait
} from "../utils/utils";
import { col } from "./common";

export const stage2: TGameObject = createGameObject({
   name: "stage2",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.spawn, enemy: "cloner", x: col[5], y: -20 },
      wait(270),
      { type: AT.spawn, enemy: "cloner", x: col[2], y: -20 },
      { type: AT.spawn, enemy: "cloner", x: col[8], y: -20 },
   ]
});

export const cloner: TGameObject = createGameObject({
   name: "cloner",
   hp: 25,
   diameter: 29,
   actions: [
      moveToAbsolute({ y: 45, frames: 150 }),
      wait(30),
      { type: AT.spawn, enemy: "clonerChild" },
      { type: AT.spawn, enemy: "clonerChild", actions: [
         { type: AT.setAttribute, attribute: "mirrorX", value: true }
      ] },
      wait(80),
      { type: AT.spawn, enemy: "clonerChild", actions: [
         { type: AT.setAttribute, attribute: "mirrorY", value: true }
      ] },
      { type: AT.spawn, enemy: "clonerChild", actions: [
         { type: AT.setAttribute, attribute: "mirrorX", value: true },
         { type: AT.setAttribute, attribute: "mirrorY", value: true }
      ]},
   ]
});

export const clonerChild: TGameObject = createGameObject({
   name: "clonerChild",
   hp: 10,
   diameter: 18,
   actions: [
      attr("mirrorX", { value: true, yes: [{ type: AT.mirrorX, value: true }] }),
      attr("mirrorY", { value: true, yes: [{ type: AT.mirrorY, value: true }] }),
      setShotSpeed(1.5),
      parallelAll(
         { type: AT.move, x: -45, y: -20, frames: 65 },
         [
            wait(60),
            forever(
               { type: AT.shootDirection, x: 0, y: 1},
               wait(40)
            ),
         ],
      )
   ]
});
