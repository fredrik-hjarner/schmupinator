export class Angle {
   public readonly radians: number;

   private constructor(radians: number) {
      while (radians < 0) {
         radians += 2 * Math.PI;
      }
      while (radians >= 2 * Math.PI) {
         radians -= 2 * Math.PI;
      }
      this.radians = radians;
   }

   public static fromRadians(radians: number): Angle {
      return new Angle(radians);
   }

   public static fromDegrees(degrees: number): Angle {
      const radians = degrees * (Math.PI / 180);
      return new Angle(radians);
   }

   public get degrees(): number {
      return this.radians * (180 / Math.PI);
   }

   public add(angle: Angle): Angle {
      return Angle.fromRadians(this.radians + angle.radians);
   }

   public subtract(angle: Angle): Angle {
      return Angle.fromRadians(this.radians - angle.radians);
   }

   public invert(): Angle {
      return Angle.fromRadians(-this.radians);
   }
}
