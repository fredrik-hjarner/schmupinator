import { BrowserDriver } from "./drivers/BrowserDriver";
import { px } from "./utils/px";
import { isHTMLDivElement } from "./utils/typeAssertions";
import { uuid } from "./utils/uuid";

/**
 * TODO:
 * The only bad thing with this class was that it had a div on it,
 * otherwise it is a legit class, that I could reusein Shot, Player and Enemy, really.
 */
export class Circle {
   private x: number;
   private y: number;
   Diameter: number;
   Radius: number;
   color: string;
   UUID: string;
   div: unknown;

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

      this.div = BrowserDriver.WithWindow(window => {
         const div = window.document.createElement("div");
   
         div.id = this.UUID;
         div.style.position = "fixed";
         div.style.boxSizing = "border-box";
         div.style.borderColor = color;
         div.style.borderStyle = "solid";
         div.style.borderWidth = px(diameter/2); // filled
         div.style.width = `${diameter}px`;
         div.style.height = `${diameter}px`;
         div.style.top = `${this.Top}px`;
         div.style.left = `${this.Left}px`;
         div.style.borderRadius = "5000px";
   
         window.document.body.appendChild(div);
   
         return div;
      });
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
      if(!isHTMLDivElement(this.div)){
         return;
      }
      this.div.style.top = px(this.Top);
      this.div.style.left = px(this.Left);
   };
}
