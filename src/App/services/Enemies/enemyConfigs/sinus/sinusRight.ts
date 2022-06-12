import type { IEnemyJson } from "../IEnemyJson";

export const rightSinus: IEnemyJson = {
   name: `sinusRight`,
   hp: 3,
   diameter: 24,
   actions: [
      { type: "set_shot_speed", pixelsPerFrame: 2 },
      { repeat: 2, actions: [
         // rotate 180 degrees and shoot.
         { type: "parallell_all", actionsLists: [[
            { type: "rotate_around_relative_point", degrees: 180, frames: 35, point: {y: 31} },
         ],[
            { wait:15 },
            { type: "shoot_toward_player" }
         ]] },
         // move right.
         { type: "move", frames: 80, movement: {x: -205, y: 30} },
         // rotate 180 degrees and shoot.
         { type: "parallell_all", actionsLists: [[
            { type: "rotate_around_relative_point", degrees: -180, frames: 35, point: {y: 31} },
         ],[
            { wait:15 },
            { type: "shoot_toward_player" }
         ]] },
         // move left.
         { type: "move", frames: 80, movement: {x: 205, y: 30 }},
      ]}
   ]
};
