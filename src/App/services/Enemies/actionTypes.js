import type { Vector } from "../../../math/bezier";

export type Action =
  /**
   * Common
   */
  { type: "wait", frames: number} |
  { type: "wait_util_frame_nr", frameNr: number} |
  { type: "repeat", times: number, actions: Action[] } |
  /**
   * Shooting
   */
  { type: "shoot_direction", dirX: number, dirY: number } |
  /**
   * Movement
   */
  { type: "move", movement: Vector, frames: number } |
  { type: "set_position", x: number, y: number } |
  { type: "move_bezier", start: Vector, bend: Vector, end: Vector, frames: number } |
  { type: "set_speed", x: number, y: number };