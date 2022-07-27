import type { IInput, TKey } from "../../../../Input/IInput";

import { centerHorizontally } from "../../utils/centering";
import { createText } from "../atoms/text";
import { fontSizes } from "../../consts/fontSizes";

type TMenuItem = {
   text: string,
   onClick: () => void
};

type TConstructor = {
   input: IInput;
   // top y position.
   top: number;
   menuItems: TMenuItem[];
};

export class Menu {
   // vars
   private top: number;
   // index is added in the render method. it's added for convenience.
   private menuItems: TMenuItem[];
   private static spaceBetweenMenuItems = 25;
   private activeItemIndex?: number;

   // deps/services
   private input: IInput;

   // elements
   private menuItemElements: HTMLDivElement[] = [];

   public constructor(params: TConstructor) {
      this.input = params.input;
      this.top = params.top;
      this.menuItems = params.menuItems.map((item, index) => ({ ...item, index }));
   }

   public render() {
      this.menuItemElements = this.menuItems.map((item, index) => {
         const element = createText({
            text: item.text,
            fontSize: fontSizes.normal,
            top: this.top + index * Menu.spaceBetweenMenuItems,
            onClick: item.onClick,
            className: "menuItem",
            onMouseEnter: () => { this.setActiveIndex(index); },
         });
         centerHorizontally(element);
         return element;
      });

      // set the first item as active by default/to begin with.
      this.setActiveIndex(0);

      // register onKey callback. TODO: REMEMBER TO UNASSIGN THIS IN DESTROY.
      this.input.onKeyUpCallback = (key: TKey) => {
         switch(key) {
            case "up":
               this.decrActive();
               break;
            case "down":
               this.incrActive();
               break;
            case "start":
               if(this.activeItemIndex !== undefined) {
                  this.menuItems[this.activeItemIndex].onClick();
               }
               break;
         }
      };
   }

   public destroy() {
      this.menuItemElements.forEach(item => {
         item.remove();
      });
      this.menuItemElements = [];

      this.activeItemIndex = undefined;
   }

   private setActiveIndex = (index: number) => {
      if(this.activeItemIndex !== index) {
         if(this.activeItemIndex !== undefined) {
            // unset the previous one.
            this.unsetActiveItem(this.activeItemIndex);
         }
         this.activeItemIndex = index;
         const element = this.menuItemElements[index];
         element.classList.add("activeMenuItem");
      }
   };
   
   private unsetActiveItem = (index: number) => {
      // I don't know maybe this if case is needed, maybe not.
      if(this.activeItemIndex === index) {
         this.activeItemIndex = undefined;
         const element = this.menuItemElements[index];
         element.classList.remove("activeMenuItem");
      }
   };

   private incrActive = () => {
      if(this.activeItemIndex === undefined) {
         return;
      }
      if(this.activeItemIndex < this.menuItems.length - 1) {
         this.setActiveIndex(this.activeItemIndex + 1);
      }
   };

   private decrActive = () => {
      if(this.activeItemIndex === undefined) {
         return;
      }
      if(this.activeItemIndex >= 1) {
         this.setActiveIndex(this.activeItemIndex - 1);
      }
   };
}
