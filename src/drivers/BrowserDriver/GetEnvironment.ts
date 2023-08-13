export type TEnvironment = "browser" | "deno" | "webworker_browser" | "webworker_deno";

export const GetEnvironment = (): TEnvironment => {
   /// @ts-ignore: does not like `WorkerGlobalScope` with current config.
   // eslint-disable-next-line no-undef
   const webworker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;

   if(webworker) {
      // eslint-disable-next-line no-undef
      if("Deno" in self) {
         return "webworker_deno";
      }
      return "webworker_browser";
   }

   // eslint-disable-next-line no-undef
   if("Deno" in window) {
      return "deno";
   }
   
   return "browser";
};