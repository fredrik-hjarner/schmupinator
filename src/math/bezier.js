export type Vector =  { x: number, y: number }

export const bezier = (bend: Vector, end: Vector, t: number): Vector => {
  return {
    x:
      2*(1-t) * t * bend.x +
      t**2 * end.x,
    y: 
      2*(1-t) * t * bend.y +
      t**2 * end.y,
  };
};