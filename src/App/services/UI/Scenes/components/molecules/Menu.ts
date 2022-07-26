import { centerHorizontally } from "../../utils/centering";
import { createText } from "../atoms/text";
import { fontSizes } from "../../consts/fontSizes";

type TMenuItem = {
   text: string,
   onClick: () => void
};

type TConstructor = {
   // top y position.
   top: number;
   menuItems: TMenuItem[];
};

type TItemWithIndex = TMenuItem & { index: number };

export class Menu {
   // vars
   private top: number;
   // index is added in the render method. it's added for convenience.
   private menuItems: TItemWithIndex[];
   private static spaceBetweenMenuItems = 25;
   private activeItem?: TMenuItem;

   // elements
   private menuItemElements: HTMLDivElement[] = [];

   public constructor(params: TConstructor) {
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
            onMouseEnter: this.onMouseEnter(item),
            onMouseLeave: this.onMouseLeave(item)
         });
         centerHorizontally(element);
         return element;
      });
   }

   public destroy() {
      this.menuItemElements.forEach(item => {
         item.remove();
      });
      this.menuItemElements = [];
   }

   private onMouseEnter = (item: TItemWithIndex) => () => {
      if(this.activeItem !== item) {
         this.activeItem = item;
         const element = this.menuItemElements[item.index];
         element.classList.add("activeMenuItem");
      }
   };
   
   private onMouseLeave = (item: TItemWithIndex) => () => {
      // I don't know maybe this if case is needed, maybe not.
      if(this.activeItem === item) {
         this.activeItem = undefined;
         const element = this.menuItemElements[item.index];
         element.classList.remove("activeMenuItem");
      }
   };
}
