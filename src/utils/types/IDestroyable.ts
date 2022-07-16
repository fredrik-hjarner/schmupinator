export interface IDestroyable {
   /**
    * Must clean up everything, all DOM elements, timers, event subscriptions etc.
    */
   destroy: () => void;
}