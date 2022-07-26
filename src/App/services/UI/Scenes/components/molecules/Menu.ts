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

export class Menu {
   // vars
   private top: number;
   private menuItems: TMenuItem[];
   private static spaceBetweenMenuItems = 25;

   // elements
   private menuItemElements: HTMLDivElement[] = [];

   public constructor(params: TConstructor) {
      this.top = params.top;
      this.menuItems = params.menuItems;
   }

   public render() {
      this.menuItemElements = this.menuItems.map((item, index) => {
         const element = createText({
            text: item.text,
            fontSize: fontSizes.normal,
            top: this.top + index * Menu.spaceBetweenMenuItems,
            onClick: item.onClick,
            className: "menuItem",
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
}
