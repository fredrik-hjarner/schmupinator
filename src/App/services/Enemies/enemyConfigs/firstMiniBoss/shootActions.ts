import { TShortFormAction } from "../../actionTypesShortForms";

export const firstMiniBossShootActions: TShortFormAction[] = [
   { wait: 75 },
   { repeat: 9999, actions: [
      { setShotSpeed: 2.6 },
      // beam
      { type: "shootDirection", x: 0, y: 1 },
      { wait: 3 },
      { type: "shootDirection", x: 0, y: 1 },
      { wait: 3 },
      { type: "shootDirection", x: 0, y: 1 },
      { wait: 64 - 3 - 3 },
      // triplets
      { setShotSpeed: 2.2 },
      { repeat: 2, actions: [
         { type: "shoot_toward_player" },
         { type: "shoot_beside_player", clockwiseDegrees: 25 },
         { type: "shoot_beside_player", clockwiseDegrees: -25 },
         { wait: 64 },
      ]}
   ]}
];
