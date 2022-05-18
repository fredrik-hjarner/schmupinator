export type Vector =  { x: number, y: number }

export const bezier = (start: Vector, bend: Vector, end: Vector, t: number): Vector => {
  return {
    x:
      (1-t)**2 * start.x +
      2(1-t)**2 * t * bend.x +
      t**2 * end.x,
    y: 
      (1-t)**2 * start.y +
      2(1-t)**2 * t * bend.y +
      t**2 * end.y,
  };
};