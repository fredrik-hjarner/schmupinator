import type { MoveAction } from "../../App/services/Enemies/Enemy";

export const firstMiniBossSMoveActions: MoveAction[] = [
  { type: 'set_speed', x: 2, y: 0 },
  { type: 'wait', frames: 60 },
  { type: 'set_speed', x: -2, y: 0 },
  { type: 'wait', frames: 60 },
];
