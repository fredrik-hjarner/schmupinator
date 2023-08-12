import type { IPseudoRandom } from "./IPseudoRandom";

import { randomNumbers } from "./randomNumbers.ts";

type TConstructor = {
   name: string;
}

export class PseudoRandom implements IPseudoRandom {
   // vars
   public readonly name: string;

   private currentIndex: number;

   public constructor({ name }: TConstructor) {
      this.name = name;

      this.currentIndex = 0;
   }

   public Init = async () => {
      // NOOP
   };

   public destroy = () => {
      // NOOP
   };

   // /** hash string to an index in randomNumbers */
   // private hashString = (input: string): number => {
   //    let hash = 0;
   //    if (input.length === 0) return hash;
   //    for (let i = 0; i < input.length; i++) {
   //       const char = input.charCodeAt(i);
   //       hash = (hash << 5) - hash + char;
   //       hash |= 0; // Convert to 32-bit integer
   //    }
   //    return Math.abs(hash) % randomNumbers.length;
   // }

   public randomInt = (_min: number, _max: number): number => {
      const randomNumber = randomNumbers[this.currentIndex];

      this.currentIndex = (this.currentIndex + 1) % randomNumbers.length;

      const min = Math.ceil(_min);
      const max = Math.floor(_max);

      return Math.floor(randomNumber * (max - min + 1) + min);
   };
}

