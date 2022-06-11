import { TShortFormAction } from "../../actionTypesShortForms";

export const firstMiniBossShootActions: TShortFormAction[] = [
   { wait: 75 },
   { type: "repeat", times: 9999, actions: [
      { type: "set_shot_speed", pixelsPerFrame: 2.6 },
      // beam
      { type: 'shoot_direction', dirX: 0, dirY: 1 },
      { wait: 3 },
      { type: 'shoot_direction', dirX: 0, dirY: 1 },
      { wait: 3 },
      { type: 'shoot_direction', dirX: 0, dirY: 1 },
      { wait: 64 - 3 - 3 },
      // triplets
      { type: "set_shot_speed", pixelsPerFrame: 2.2 },
      { type: "repeat", times: 2, actions: [
         { type: 'shoot_toward_player' },
         { type: 'shoot_beside_player', clockwiseDegrees: 25 },
         { type: 'shoot_beside_player', clockwiseDegrees: -25 },
         { wait: 64 },
      ]}
   ]}
];
