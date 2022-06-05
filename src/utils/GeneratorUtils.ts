type TRepeatArgs<X, Y, Z> = {
  makeGenerator: () => Generator<X, Y, Z>;
  times: number;
}

export class GeneratorUtils {
  static Repeat = function*<X, Y, Z>({ makeGenerator, times }: TRepeatArgs<X, Y, Z>) {
    for(let i=0; i<times; i++) {
      yield* makeGenerator(); // must create the generator anew.
    }
  };
}
