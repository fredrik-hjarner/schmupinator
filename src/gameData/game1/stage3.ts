import type { IEnemyJson } from "../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { attr, createGameObject, forever, wait } from "../utils";
import { col, row } from "./common";

export const stage3: IEnemyJson = createGameObject({
   name: "stage3",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.spawn, enemy: "shapeShifter", x: col[5], y: row[5] },
      { type: AT.spawn, enemy: "healer", x: col[4], y: row[4] },
      { type: AT.spawn, enemy: "dehealer", x: col[6], y: row[4] },
   ]
});

export const shapeShifter: IEnemyJson = createGameObject({
   name: "shapeShifter",
   diameter: 30,
   hp: 100,
   onDeathAction: { type: AT.spawn, enemy: "shapeShifter", y: -20 },
   actions: [
      forever(
         { type: AT.gfxSetShape, shape: "circle" },
         wait(60),
         { type: AT.gfxSetShape, shape: "square" },
         wait(60),
         { type: AT.gfxSetShape, shape: "triangle" },
         wait(60),
         { type: AT.gfxSetShape, shape: "diamondShield" },
         wait(60),
         { type: AT.gfxSetShape, shape: "octagon" },
         wait(60),
      )
   ]
});

export const healer: IEnemyJson = createGameObject({
   name: "healer",
   diameter: 30,
   hp: 50,
   actions: [
      { type: AT.setAttribute, attribute: "hp", value: 25 },
      forever(
         wait(10),
         attr("hp", {
            is: 50,
            no: [{ type: AT.incr, attribute: "hp" }]
         })
      )
   ]
});

export const dehealer: IEnemyJson = createGameObject({
   name: "dehealer",
   diameter: 30,
   hp: 50,
   actions: [
      forever(
         wait(10),
         { type: AT.decr, attribute: "hp" }
      )
   ]
});
