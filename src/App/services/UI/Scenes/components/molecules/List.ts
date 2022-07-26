import { centerHorizontally } from "../../utils/centering";
import { createText } from "../atoms/text";
import { fontSizes } from "../../consts/fontSizes";

type TListItem = {
   text: string,
};

type TConstructor = {
   // top y position.
   top: number;
   items: TListItem[];
};

export class List {
   // vars
   private top: number;
   private items: TListItem[];
   private static spaceBetweenItems = 25;

   // elements
   private itemElements: HTMLDivElement[] = [];

   public constructor(params: TConstructor) {
      this.top = params.top;
      this.items = params.items;
   }

   public render() {
      this.itemElements = this.items.map((item, index) => {
         const element = createText({
            text: item.text,
            fontSize: fontSizes.normal,
            top: this.top + index * List.spaceBetweenItems,
            className: "listItem",
         });
         centerHorizontally(element);
         return element;
      });
   }

   public destroy() {
      this.itemElements.forEach(item => {
         item.remove();
      });
      this.itemElements = [];
   }
}
