import type { IEnemyJson } from "../IEnemyJson";

import { uuid } from "../../../../../utils/uuid";

type TCreateSinusRightArgs = {
  spawnOnFrame: number;
}

export const createRightSinus = (
   { spawnOnFrame }: TCreateSinusRightArgs
): IEnemyJson => {
   return {
      name: `sinusRight-${uuid()}`,
      spawnOnFrame,
      hp: 3,
      diameter: 24,
      startPosition: {x: 280, y: -20},
      actions: [
         { type: 'set_shot_speed', pixelsPerFrame: 2 },
         { type: 'repeat' , times: 2, actions: [
            // rotate 180 degrees and shoot.
            { type: "parallell_all", actionsLists: [[
               { type: "rotate_around_relative_point", degrees: 180, frames: 35, point: {y: 31} },
            ],[
               { type: 'wait', frames:15 },
               { type: 'shoot_toward_player' }
            ]] },
            // move right.
            { type: "move", frames: 80, movement: {x: -205, y: 30} },
            // rotate 180 degrees and shoot.
            { type: "parallell_all", actionsLists: [[
               { type: "rotate_around_relative_point", degrees: -180, frames: 35, point: {y: 31} },
            ],[
               { type: 'wait', frames:15 },
               { type: 'shoot_toward_player' }
            ]] },
            // move left.
            { type: "move", frames: 80, movement: {x: 205, y: 30 }},
         ]}
      ]
   };
};