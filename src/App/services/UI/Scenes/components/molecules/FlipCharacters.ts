import type { IInput } from "../../../../Input/IInput";

import { createText } from "../atoms/text";
import { fontSizes } from "../../consts/fontSizes";

const charList = [
   "_",
   "a", "b", "c", "d","e","f","g","h","i","j","k","l","m","n",
   "o","p","q","r","s","t","u","v","w","x","y","z",
   "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

type TConstructor = {
   input: IInput;
   // top y position.
   top: number;
   onDone: (name: string) => void
};

export class FlipCharacters {
   // vars
   private top: number;
   private caretIndex = 0;
   private charIndices: [number, number, number, number, number, number] = [
      0, 0, 0, 0, 0, 0
   ];
   private onDone: (name: string) => void;

   // deps/services
   private input: IInput;

   // elements
   private charElements: HTMLDivElement[] = [];

   public constructor(params: TConstructor) {
      this.input = params.input;
      this.top = params.top;
      this.onDone = params.onDone;
   }

   public render() {
      const menuItems = this.charIndices
         .map(i => charList[i])
         .map(c => ({ text: c }));

      const chars = menuItems.map((item, index) => ({ ...item, index }));

      this.charElements = chars.map((item, index) => {
         const fontSize = fontSizes.large;
         const element = createText({
            text: item.text,
            fontSize,
            top: this.top,
            left: 136 + index * fontSize * 0.37,
            className: "menuItem",
            onMouseEnter: () => { this.setCaretIndex(index); },
         });
         return element;
      });

      // set the first item as active by default/to begin with.
      this.setCaretIndex(0);

      // register onKey callback.
      this.input.onKeyUpCallback = key => {
         switch(key) {
            case "up":
               this.incrCurrCharIndex();
               break;
            case "down":
               this.decrCurrCharIndex();
               break;
            case "left":
               this.decrCaretIndex();
               break;
            case "right":
               this.incrCaretIndex();
               break;
            case "start":
               this.onDone(this.getEnteredString());
               break;
         }
      };
   }

   public destroy() {
      // Must unregister the callback.
      this.input.onKeyUpCallback = undefined;

      this.charElements.forEach(item => {
         item.remove();
      });
      this.charElements = [];

      this.caretIndex = 0;
   }

   /**
    * Get the string that the player has put in.
    */
   private getEnteredString = (): string => {
      return this.charIndices.map(i => charList[i]).join("").replace("_", " ");
   };

   private updateCurrChar = () => {
      const charIndex = this.charIndices[this.caretIndex];
      this.charElements[this.caretIndex].innerHTML = charList[charIndex];
   };

   private incrCurrCharIndex = () => {
      this.charIndices[this.caretIndex]++;
      if(this.charIndices[this.caretIndex] > charList.length - 1) {
         this.charIndices[this.caretIndex] = 0;
      }
      this.updateCurrChar();
   };

   private decrCurrCharIndex = () => {
      this.charIndices[this.caretIndex]--;
      if(this.charIndices[this.caretIndex] < 0) {
         this.charIndices[this.caretIndex] = charList.length - 1;
      }
      this.updateCurrChar();
   };

   private setCaretIndex = (index: number) => {
      if(this.caretIndex !== index) {
         this.charElements[this.caretIndex].classList.remove("activeMenuItem");
         this.caretIndex = index;
         const element = this.charElements[index];
         element.classList.add("activeMenuItem");
      }
   };

   private incrCaretIndex = () => {
      if(this.caretIndex === undefined) {
         return;
      }
      if(this.caretIndex < this.charIndices.length - 1) {
         this.setCaretIndex(this.caretIndex + 1);
      }
   };

   private decrCaretIndex = () => {
      if(this.caretIndex === undefined) {
         return;
      }
      if(this.caretIndex >= 1) {
         this.setCaretIndex(this.caretIndex - 1);
      }
   };
}
