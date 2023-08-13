import type {
   TLocalStorageGetItemRequest,
   TLocalStorageGetItemResponse,
   TLocalStorageSetItemRequest
} from "../types";

export class LocalStorage_MainThread {
   private worker: Worker;

   public constructor(worker: Worker) {
      this.worker = worker;
   }

   public getItem = (message: TLocalStorageGetItemRequest) => {
      const response: TLocalStorageGetItemResponse = {
         service: "localStorage",
         type: "getItemResponse",
         // eslint-disable-next-line no-undef
         value: localStorage.getItem(message.key),
      };
      this.worker.postMessage(response);
   };

   public setItem = (message: TLocalStorageSetItemRequest) => {
      // eslint-disable-next-line no-undef
      localStorage.setItem(message.key, message.value);
   };
}
