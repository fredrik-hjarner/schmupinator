import { IDestroyable } from "../types/IDestroyable";

/**
 * A helper class to make it a bit easier to work with destroyables.
 * Allows you to add destroyables to it, and then destroy all of them with Destroyables.destroy().
 * 
 * TODO: Something I could do here is keep a count of how many has been added and destroyed,
 * that might help in finding "memory leaks".
 */
export class Destroyables implements IDestroyable {
   private destroyables: IDestroyable[] = [];

   /**
    * Add a IDestroyable to be managed by this Destroyables.
    */
   public add = (destroyable: IDestroyable) => {
      this.destroyables.push(destroyable);
   };

   /**
    * Destroy all added IDestroyable:s.
    */
   public destroy = () => {
      if(this.destroyables.length === 0) {
         console.warn(
            "Destroyable.destroy: no IDestroyable:s to destroy since this.destroyables is empty."
         );
      }
      this.destroyables.forEach(d => { d.destroy(); });
   };
}