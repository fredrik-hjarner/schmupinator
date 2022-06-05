import type { IEnemyJson } from "../IEnemyJson";

import { resolutionWidth } from "../../../../../consts";
import { uuid } from "../../../../../utils/uuid";

export const nonShootingAimer: IEnemyJson = {
  name: `nonShootingAimer-${uuid()}`,
  spawnOnFrame: 1,
  hp: 1,
  startPosition: {
    x: resolutionWidth*0.333,
    y: -20
  },
  actions: [
    { type: 'set_speed', pixelsPerFrame: 1.50 },
    { type: "parallell_all", actionsLists: [[
      { type: "repeat", times: (60/8)*5, actions: [
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
