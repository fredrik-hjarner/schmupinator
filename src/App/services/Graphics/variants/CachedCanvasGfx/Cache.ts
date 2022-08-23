type TConstructor = {
   maxSize?: number;
};

export class Cache<T> {
   // vars
   private cache: Partial<Record<string, T>> = {};
   //@ts-ignore: TODO: Not used bit will prolly be used in future.
   private maxSize: number;

   public constructor({ maxSize=9999 }: TConstructor) {
      this.maxSize = maxSize;
   }

   public tryGet = (key: string): T | undefined => {
      // console.log("tryGet:", key);
      return this.cache[key];
   };

   public add = (key: string, value: T) => {
      this.cache[key] = value;
      // const cachedGfxs = Object.keys(this.cache).length;
      // console.log("cached gfxs:", cachedGfxs);
   };
}