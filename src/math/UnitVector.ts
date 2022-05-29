import { Angle } from "./Angle";
import { Vector } from "./Vector";

export class UnitVector {
  private vector: Vector;

  constructor(vector: Vector) {
    const length = vector.length;
    if (length === 0) {
      this.vector = new Vector(0, 1);
      return;
    }
    const ajustmentFactor = 1 / length;
    const newX = vector.x * ajustmentFactor;
    const newY = vector.y * ajustmentFactor;
    this.vector = new Vector(newX, newY);
  }

  get x(): number {
    return this.vector.x;
  }

  get y(): number {
    return this.vector.y;
  }

  rotateClockwise(angle: Angle): UnitVector {
    const x = this.vector.x;
    const y = this.vector.y;
    const radians = angle.radians;
    const newX = Math.cos(radians) * x - Math.sin(radians) * y;
    const newY = Math.sin(radians) * x + Math.cos(radians) * y;
    return new UnitVector(new Vector(newX, newY));
  }

  toVector(): Vector {
    return new Vector(this.vector.x, this.vector.y);
  }

  static merge(unitVectors: UnitVector[]): UnitVector {
    const vectors = unitVectors.map((uv) => uv.toVector());
    const sumVector = Vector.sum(vectors);
    return new UnitVector(sumVector);
  }

  /**
   * Assumes that the normal is straight up,
   * when start is left of end and line is completely
   * horizontal.
   */
  static normalFromPositions = (start: Vector, end: Vector): UnitVector => {
    const vector = Vector.fromTo(start, end);
    const unitVector = new UnitVector(vector);
    const normalVector = unitVector.rotateClockwise(Angle.fromDegrees(90));
    return normalVector;
  };

  //#region mutations

  // Mutation functions are suffixed with a "M"

  toVectorM(): Vector {
    return this.vector;
  }

  //#endregion
}
