import { Angle } from "./Angle";

export class Vector {
   public x: number;
   public y: number;

   public constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
   }

   // TODO: rename to `vectorFromTo`
   public static fromTo(start: Vector, end: Vector): Vector {
      const x = end.x - start.x;
      const y = end.y - start.y;
      return new Vector(x, y);
   }

   // TODO: This should not be a getter it should be a field.
   public get length(): number {
      return (this.x ** 2 + this.y ** 2) ** 0.5;
   }

   public rotateClockwise(angle: Angle): Vector {
      const x = this.x;
      const y = this.y;
      const radians = angle.radians;
      const newX = Math.cos(radians) * x - Math.sin(radians) * y;
      const newY = Math.sin(radians) * x + Math.cos(radians) * y;
      return new Vector(newX, newY);
   }

   public rotateClockwiseAroundVector(angle: Angle, vector: Vector): Vector {
      const placedAtOrigo = this.subtract(vector);
      const rotated = placedAtOrigo.rotateClockwise(angle);
      return rotated.add(vector);
   }

   public setLength(length: number): Vector {
      if (this.length === 0) {
      /**
       * This is stupid edge case, but there is no good value really
       */
         console.warn("Trying to set length of a vector with zero length");
         return new Vector(0, length);
      }
      const ajustmentFactor = length / this.length;
      const newX = this.x * ajustmentFactor;
      const newY = this.y * ajustmentFactor;
      return new Vector(newX, newY);
   }

   // TODO: Write tests for this. This is probably incorrect.
   public dot(vector: Vector): number {
      return this.x * vector.x + this.y * vector.y;
   }

   public inSameDirection = (vector: Vector): boolean => {
      return this.dot(vector) > 0;
   };

   // TODO: Write tests for this. This might be broken.
   public projectOn(vector: Vector): Vector {
      const length = this.dot(vector) / vector.length;
      return vector.setLength(length);
   }

   public add(vector: Vector) {
      return new Vector(this.x + vector.x, this.y + vector.y);
   }

   public subtract(vector: Vector) {
      return new Vector(this.x - vector.x, this.y - vector.y);
   }

   public scale(factor: number) {
      const newX = this.x * factor;
      const newY = this.y * factor;
      return new Vector(newX, newY);
   }

   public get angle(): Angle {
      return Angle.fromRadians(Math.atan2(this.y, this.x) + Math.PI/2);
   }

   public antiClockwiseAngleTo = (vector: Vector): Angle => {
      return Angle.fromRadians(vector.angle.radians - this.angle.radians);
   };

   // Seems to assume they both have the same origin position, sort of.
   public leftOf = (vector: Vector): boolean => {
      const angle = vector.antiClockwiseAngleTo(this);
      return angle.degrees < 180;
   };

   public static sum(vectors: Vector[]): Vector {
      const { x, y } = vectors.reduce(
         (acc, vector) => {
            acc.x += vector.x;
            acc.y += vector.y;
            return acc;
         },
         { x: 0, y: 0 }
      );
      return new Vector(x, y);
   }

   public static merge(vectors: Vector[]): Vector {
      const sumVector = Vector.sum(vectors);
      return sumVector.scale(1 / vectors.length);
   }

   public merge(vector: Vector, factorToMergeIn: number): Vector {
      return this.scale(1 - factorToMergeIn).add(vector.scale(factorToMergeIn));
   }

   public clone = (): Vector => {
      return new Vector(this.x, this.y);
   };

   //#region mutations

   // Mutation functions are suffixed with a "M"

   public rotateClockwiseM(angle: Angle): this {
      const x = this.x;
      const y = this.y;
      const radians = angle.radians;
      this.x = Math.cos(radians) * x - Math.sin(radians) * y;
      this.y = Math.sin(radians) * x + Math.cos(radians) * y;
      return this;
   }

   //#endregion
}
