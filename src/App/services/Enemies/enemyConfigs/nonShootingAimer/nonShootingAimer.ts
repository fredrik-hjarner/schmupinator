import type { IEnemyJson } from "../IEnemyJson";
import type { Vector as TVector } from "../../../../../math/bezier";

type TCreateNonShootingAimerArgs = {
  spawnOnFrame: number;
  spawnPosition: TVector;
}

export const createNonShootingAimer = (
   { spawnOnFrame, spawnPosition }: TCreateNonShootingAimerArgs
): IEnemyJson => {
   return {
      name: `nonShootingAimer`,
      spawnOnFrame,
      hp: 4,
      diameter: 22,
      startPosition: spawnPosition,
      actions: [
         { type: 'set_speed', pixelsPerFrame: 1.60 },
         { type: "parallell_all", actionsLists: [[
            { type: "repeat", times: (60/8)*3.5, actions: [
               { type: 'rotate_towards_player' },
               { type: "wait", frames: 8 }
            ] }
         ],[
            { type: "repeat", times: 60*10, actions: [
               { type: 'move_according_to_speed_and_direction' },
               { type: "wait_next_frame" }
            ] }
         ]] },
      ]
   };
};
