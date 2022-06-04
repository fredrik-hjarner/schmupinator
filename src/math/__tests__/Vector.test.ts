import { Angle } from "../Angle";
import { Vector } from "../Vector";

describe("simple cardinal directions", () => {
  it("Vector.fromTo straight up", () => {
    const start = new Vector(0, 0);
    const end = new Vector(0, 1);
    const vector = Vector.fromTo(start, end);
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(1);
  });

  it("Vector.fromTo straight down", () => {
    const start = new Vector(0, 0);
    const end = new Vector(0, -1);
    const vector = Vector.fromTo(start, end);
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(-1);
  });

  it("Vector.fromTo straight left", () => {
    const start = new Vector(0, 0);
    const end = new Vector(-1, 0);
    const vector = Vector.fromTo(start, end);
    expect(vector.x).toBe(-1);
    expect(vector.y).toBe(0);
  });

  it("Vector.fromTo straight right", () => {
    const start = new Vector(0, 0);
    const end = new Vector(1, 0);
    const vector = Vector.fromTo(start, end);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(0);
  });
});

describe("simple cardinal directions reversed", () => {
  it("Vector.fromTo straight up. reversed", () => {
    const start = new Vector(0, 1);
    const end = new Vector(0, 0);
    const vector = Vector.fromTo(start, end);
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(-1);
  });
});

describe("lengths", () => {
  it("zero", () => {
    const vector = new Vector(0, 0);
    expect(vector.length).toBe(0);
  });

  it("one left", () => {
    const vector = new Vector(-1, 0);
    expect(vector.length).toBe(1);
  });

  it("one up", () => {
    const vector = new Vector(0, 1);
    expect(vector.length).toBe(1);
  });

  it("sqrt2 diagonal", () => {
    const vector = new Vector(1, 1);
    expect(vector.length).toBeCloseTo(2 ** 0.5);
  });
});

describe("rotations", () => {
  it("zero", () => {
    const vector = new Vector(0, 0);
    const newVector = vector.rotateClockwise(Angle.fromDegrees(90));
    expect(newVector.x).toBeCloseTo(0);
    expect(newVector.y).toBeCloseTo(0);
  });

  it("right to up", () => {
    const vector = new Vector(1, 0);
    const newVector = vector.rotateClockwise(Angle.fromDegrees(90));
    expect(newVector.x).toBeCloseTo(0);
    expect(newVector.y).toBeCloseTo(1);
  });
});

describe("angle", () => {
  it("0", () => {
    const v1 = new Vector(1, 0);
    expect(v1.angle.degrees).toBeCloseTo(0);
  });

  it("90", () => {
    const v1 = new Vector(0, 1);
    expect(v1.angle.degrees).toBeCloseTo(90);
  });

  it("180", () => {
    const v1 = new Vector(-1, 0);
    expect(v1.angle.degrees).toBeCloseTo(180);
  });

  it("270", () => {
    const v1 = new Vector(0, -1);
    expect(v1.angle.degrees).toBeCloseTo(270);
  });
});

describe("antiClockwiseAngleTo", () => {
  it("0", () => {
    const v1 = new Vector(1, 0);
    const v2 = new Vector(1, 0);
    const angle = v1.antiClockwiseAngleTo(v2);
    expect(angle.degrees).toBeCloseTo(0);
  });

  it("90", () => {
    const v1 = new Vector(1, 0);
    const v2 = new Vector(0, 1);
    const angle = v1.antiClockwiseAngleTo(v2);
    expect(angle.degrees).toBeCloseTo(90);
  });

  it("180", () => {
    const v1 = new Vector(1, 0);
    const v2 = new Vector(-1, 0);
    const angle = v1.antiClockwiseAngleTo(v2);
    expect(angle.degrees).toBeCloseTo(180);
  });

  it("270", () => {
    const v1 = new Vector(1, 0);
    const v2 = new Vector(0, -1);
    const angle = v1.antiClockwiseAngleTo(v2);
    expect(angle.degrees).toBeCloseTo(270);
  });
});

describe("leftOf", () => {
  it("90 deg left of", () => {
    const v1 = new Vector(1, 0);
    const v2 = new Vector(0, 1);
    expect(v2.leftOf(v1)).toBe(true);
  });

  it("90 deg right of", () => {
    const v1 = new Vector(1, 0);
    const v2 = new Vector(0, -1);
    expect(v2.leftOf(v1)).toBe(false);
  });
});
