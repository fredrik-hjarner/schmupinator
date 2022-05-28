import { px } from "./utils/px";
import { uuid } from "./utils/uuid";

export class Circle {
  x: number;
  y: number;
  Diameter: number;
  Radius: number;
  color: string;
  UUID: string;
  div?: HTMLDivElement;

  /**
   * Public
   */
  constructor(x: number, y: number, diameter: number, color = "red") {
    this.x = x;
    this.y = y;
    this.Diameter = diameter;
    this.Radius = diameter/2;
    this.color = color;
    this.UUID = `${uuid()}`;

    this.div = (() => {
      const div = document.createElement("div");

      div.id = this.UUID;
      div.style.position = "fixed";
      div.style.boxSizing = "border-box";
      div.style.borderColor = color;
      div.style.borderStyle = "solid";
      div.style.borderWidth = "1px";
      div.style.width = `${diameter}px`;
      div.style.height = `${diameter}px`;
      div.style.top = `${this.Top}px`;
      div.style.left = `${this.Left}px`;
      div.style.borderRadius = "5000px";

      document.body.appendChild(div);

      return div;
    })();
  }

  get X(){ return this.x; }
  set X(v){ this.x = v; this.updatePos(); }

  get Y(){ return this.y; }
  set Y(v){ this.y = v; this.updatePos(); }

  get Top(){ return this.y - this.Radius; }
  set Top(v){ this.y = v + this.Radius; this.updatePos(); }

  get Bottom(){ return this.y + this.Radius; }
  set Bottom(v){ this.y = v - this.Radius; this.updatePos(); }

  get Left(){ return this.x - this.Radius; }
  set Left(v){ this.x = v + this.Radius; this.updatePos(); }

  get Right(){ return this.x + this.Radius; }
  set Right(v){ this.x = v - this.Radius; this.updatePos(); }

  /**
   * Private
   */
  updatePos = () => {
    this.div.style.top = px(this.Top);
    this.div.style.left = px(this.Left);
  };
}
