export class Angle {
   readonly radians: number;

   private constructor(radians: number) {
      while (radians < 0) {
         radians += 2 * Math.PI;
      }
      while (radians >= 2 * Math.PI) {
         radians -= 2 * Math.PI;
      }
      this.radians = radians;
   }

   static fromRadians(radians: number): Angle {
      return new Angle(radians);
   }

   static fromDegrees(degrees: number): Angle {
      const radians = degrees * (Math.PI / 180);
      return new Angle(radians);
   }

   get degrees(): number {
      return this.radians * (180 / Math.PI);
   }

   add(angle: Angle): Angle {
      return Angle.fromRadians(this.radians + angle.radians);
   }

   subtract(angle: Angle): Angle {
      return Angle.fromRadians(this.radians - angle.radians);
   }

   invert(): Angle {
      return Angle.fromRadians(-this.radians);
   }
}
