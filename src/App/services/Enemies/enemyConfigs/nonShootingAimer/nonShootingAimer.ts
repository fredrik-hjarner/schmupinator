import type { IEnemyJson } from "../IEnemyJson";

export const nonShootingAimer: IEnemyJson = {
   name: `nonShootingAimer`,
   hp: 4,
   diameter: 22,
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
