export type Vector =  { x: number, y: number }

export const moveLine = (start: Vector, movement: Vector, t: number): Vector => {
   return {
      x:
         start.x +
         t * movement.x,
      y: 
         start.y +
         t * movement.y,
   };
};