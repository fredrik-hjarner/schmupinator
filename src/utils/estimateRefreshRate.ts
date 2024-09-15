import { sleep } from "./sleep.ts";

const framesToCollect = 120;

/**
 * TODO: Move this into BrowserDriver.
 */
export const estimateRefreshRate = async (): Promise<number> => {
   await sleep(1000);

   const DOMHighResTimeStampCollection: number[] = [];

   return new Promise(resolve => {
      const triggerAnimation = function(DOMHighResTimeStamp: number){
         DOMHighResTimeStampCollection.push(DOMHighResTimeStamp);
   
         if (DOMHighResTimeStampCollection.length === framesToCollect + 1) {
            const fps = Math.round(
               1000 * framesToCollect / (DOMHighResTimeStamp - DOMHighResTimeStampCollection[0])
            );
   
            resolve(fps);
         } else {
            // eslint-disable-next-line no-undef
            requestAnimationFrame(triggerAnimation);
         }
      };
      
      // eslint-disable-next-line no-undef
      requestAnimationFrame(triggerAnimation);
   });
};
