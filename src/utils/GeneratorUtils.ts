type TRepeatArgs<X, Y, Z> = {
  makeGenerator: () => Generator<X, Y, Z>;
  times: number;
}

export class GeneratorUtils {
   static Repeat = function*<X,Y,Z>({ makeGenerator, times }: TRepeatArgs<X,Y,Z>) {
      for(let i=0; i<times; i++) {
         yield* makeGenerator(); // must create the generator anew.
      }
   };

   /**
    * TODO: Fix code duplication with parallal_race paralell_all.
    * TODO: Untested. Test this.
    */
   static ParallellRace = function*<X,Y,Z>(generators: Generator<X, Y, Z>[]) {
      // advance generators one step.
      let results = generators.map(generator => generator.next());
      // Loop until one is done
      while(!results.some(result => result.done)) {
      // yield because after running once, something needed to wait/yield.
         yield;
         // advance generators one step.
         results = generators.map(generator => generator.next());
      }
   };

   /**
    * TODO: Fix code duplication with parallal_race paralell_all.
    * TODO: Untested. Test this.
    */
   static ParallellAll = function*<X,Y,Z>(generators: Generator<X, Y, Z>[]) {
      // advance generators one step.
      let results = generators.map(generator => generator.next());
      // Loop until all are done
      while(!results.every(result => result.done)) {
      // yield because after running once, something needed to wait/yield.
         yield;
         // advance generators one step.
         results = generators.map(generator => generator.next());
      }
   };
}
