import { UnitVector } from "../UnitVector";
import { Vector } from "../Vector";

it("Origo points up (things is theres no good solution)", () => {
  const vector = new Vector(0, 0);
  const unitVector = new UnitVector(vector);
  expect(unitVector.x).toBe(0);
  expect(unitVector.y).toBe(1);
});

it("Length 1 should make no difference", () => {
  {
    const unitVector = new UnitVector(new Vector(1, 0));
    expect(unitVector.x).toBe(1);
    expect(unitVector.y).toBe(0);
  }

  {
    const unitVector = new UnitVector(new Vector(0, 1));
    expect(unitVector.x).toBe(0);
    expect(unitVector.y).toBe(1);
  }

  {
    const unitVector = new UnitVector(new Vector(-1, 0));
    expect(unitVector.x).toBe(-1);
    expect(unitVector.y).toBe(0);
  }

  {
    const unitVector = new UnitVector(new Vector(0, -1));
    expect(unitVector.x).toBe(0);
    expect(unitVector.y).toBe(-1);
  }
});

it("too long diagonal ones", () => {
  {
    const unitVector = new UnitVector(new Vector(1, 1));
    expect(unitVector.x).toBeCloseTo(0.7071);
    expect(unitVector.y).toBeCloseTo(0.7071);
  }

  {
    const unitVector = new UnitVector(new Vector(-1, -1));
    expect(unitVector.x).toBeCloseTo(-0.7071);
    expect(unitVector.y).toBeCloseTo(-0.7071);
  }
});
