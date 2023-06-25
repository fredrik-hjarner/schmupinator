import { it, expect } from "vitest";

import { GeneratorUtils } from "../GeneratorUtils";

it("Test normal generator behaviour", () => {
   const generator = (function* () {
      yield 1;
      yield 2;
      yield 3;
   })();

   expect(generator.next()).toEqual({ done: false, value: 1 });
   expect(generator.next()).toEqual({ done: false, value: 2 });
   expect(generator.next()).toEqual({ done: false, value: 3 });
   expect(generator.next()).toEqual({ done: true, value: undefined });
});

it("Test repeat 2", () => {
   const makeGenerator = function* () {
      yield 1;
      yield 2;
      yield 3;
   };

   const generator = GeneratorUtils.Repeat({ makeGenerator: () => makeGenerator(), times: 2 });

   expect(generator.next()).toEqual({ done: false, value: 1 });
   expect(generator.next()).toEqual({ done: false, value: 2 });
   expect(generator.next()).toEqual({ done: false, value: 3 });
   expect(generator.next()).toEqual({ done: false, value: 1 });
   expect(generator.next()).toEqual({ done: false, value: 2 });
   expect(generator.next()).toEqual({ done: false, value: 3 });
   expect(generator.next()).toEqual({ done: true, value: undefined });
});

it("Repeat nothing twice. Expect done immediately.", () => {
   // eslint-disable-next-line @typescript-eslint/no-empty-function
   const makeGenerator = function* () { };
   const generator = GeneratorUtils.Repeat({ makeGenerator: () => makeGenerator(), times: 2 });
   expect(generator.next()).toEqual({ done: true, value: undefined });
});

export {};