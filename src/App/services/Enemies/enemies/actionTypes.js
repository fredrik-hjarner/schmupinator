export type Action =
  /**
   * Common
   */
  { type: "wait", frames: number} |
  { type: "wait_util_frame_nr", framenr: number} |
  /**
   * Shooting
   */
  { type: "shoot_direction", dirX: number, dirY: number } |
  /**
   * Movement
   */
   { type: "set_speed", x: number, y: number };