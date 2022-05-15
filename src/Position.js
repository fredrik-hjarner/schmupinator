export class Circle {
  /**
   * Public
   */
  constructor(X: number, Y: number, diameter: number) {
    this.X = X;
    this.Y = Y;
    this.Diameter = diameter;
    this.Radius = diameter/2;
  }

  get Top(){ return this.Y - this.Radius; }
  set Top(v){ this.Y = v + this.Radius; }

  get Bottom(){ return this.Y + this.Radius; }
  set Bottom(v){ this.Y = v - this.Radius; }

  get Left(){ return this.X - this.Radius; }
  set Left(v){ this.X = v + this.Radius; }

  get Right(){ return this.X + this.Radius; }
  set Right(v){ this.X = v - this.Radius; }
}
