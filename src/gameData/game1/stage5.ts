import type { IEnemyJson } from "../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { forever, repeat, spawn, wait } from "../utils";
import { col, row } from "./common";

export const stage5: IEnemyJson = {
   name: "stage5",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.gfxSetShape, shape: "none" },
      spawn("aqua", { x: col[1], y: row[3] }),
      spawn("executor", { x: col[2], y: row[5] }),
      spawn("shotSpeedFromHp", { x: col[3], y: row[5] }),
      spawn("repeatFromHp", { x: col[4], y: row[5] }),
      spawn("parent", { x: col[7], y: row[5] }),
   ],
};

// Proves that attribute getter work with wait action.
export const shotSpeedFromHp: IEnemyJson = {
   name: "shotSpeedFromHp",
   diameter: 20,
   hp: 50,
   actions: [
      { type: AT.gfxSetShape, shape: "octagon" },
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setShotSpeed, pixelsPerFrame: 1.8 },
      forever(
         wait({ attr: "hp" }),
         { type: AT.shootDirection, x: 0, y: -1 },
      )
   ],
};

// Proves that attribute getter work with repeat action.
export const repeatFromHp: IEnemyJson = {
   name: "repeatFromHp",
   diameter: 20,
   hp: 50,
   actions: [
      { type: AT.gfxSetShape, shape: "octagon" },
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setShotSpeed, pixelsPerFrame: 1.8 },
      forever(
         repeat({ attr: "hp" }, [
            wait(1)
         ]),
         { type: AT.shootDirection, x: 0, y: -1 },
      )
   ],
};

export const executor: IEnemyJson = {
   name: "executor",
   diameter: 30,
   hp: 100_000,
   actions: [
      { type: AT.gfxSetColor, color: "green" },
      forever(
         { type: AT.setAttribute, gameObjectId: "global", attribute: "aquaShoot", value: true },
         wait(1),
         { type: AT.setAttribute, gameObjectId: "global", attribute: "aquaShoot", value: false },
         wait(35),
      )
   ],
};

export const aqua: IEnemyJson = {
   name: "aqua",
   diameter: 30,
   hp: 100_000,
   actions: [
      { type: AT.gfxSetColor, color: "aqua" },
      { type: AT.setShotSpeed, pixelsPerFrame: 2 },
      forever(
         { type: AT.waitUntilAttrIs, gameObjectId: "global", attr: "aquaShoot", is: true },
         { type: AT.shootDirection, x: 0, y: 1 },
         wait(1),
      )
   ],
};

/**
 * Proves that children have parents (parentId is stored in attribute "parentId" on the child).
 * Shooting on 
 */
export const child: IEnemyJson = {
   name: "child",
   diameter: 20,
   hp: 100_000,
   actions: [
      { type: AT.gfxSetColor, color: "aqua" },
      { type: AT.waitUntilAttrIs, gameObjectId: { attr: "parentId" }, attr: "hp", is: 0 },
      { type: AT.die },
   ],
};
export const parent: IEnemyJson = {
   name: "parent",
   diameter: 25,
   hp: 5,
   actions: [
      { type: AT.gfxSetColor, color: "red" },
      spawn("child", { x: -30,   y: -30 }),
      spawn("child", { x: 0,     y: -30 }),
      spawn("child", { x: 30,    y: -30 }),
   ],
};