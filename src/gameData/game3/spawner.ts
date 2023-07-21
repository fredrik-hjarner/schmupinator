import type { IEnemyJson } from "../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import {
   // fork,
   spawn,
   // wait
} from "../utils";

export const spawner: IEnemyJson = {
   name: "spawner",
   diameter: 20,
   hp: 9999,
   actions: [
      // fork(
      //    wait(100),
      //    { type: "finishLevel" }
      // ),
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      // { wait: 1 },
      spawn("player", { x: 178.5, y: 220 }),
      spawn("pacifistStage")
   ]
};
