export const IsBrowser = (): boolean => {
   const windowType = typeof window;
   if (windowType === "undefined") {
      return false; // NodeJS
   }

   // eslint-disable-next-line no-undef
   if ("Deno" in window) {
      return false; // Deno
   }

   return true; // Browser
};