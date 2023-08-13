import type {
   TLocalStorageGetItemRequest,
   TLocalStorageGetItemResponse,
   TLocalStorageSetItemRequest
} from "../types";

export class LocalStorage_WorkerThread {
   public getItem = async (key: string): Promise<TLocalStorageGetItemResponse["value"]> => {
      const message: TLocalStorageGetItemRequest = {
         service: "localStorage",
         type: "getItemRequest",
         key
      };
      // eslint-disable-next-line no-undef
      postMessage(message);
      return new Promise((resolve, reject) => {
         // eslint-disable-next-line no-undef
         onmessage = (ev) => {
            const data = ev.data as TLocalStorageGetItemResponse;
            if("type" in data && data.type === "getItemResponse") {
               resolve(data.value);
            } else {
               reject(new Error(`Settings.Init: onmessage: unknown message type: ${data.type}`));
            }
         };
      });
   };

   public setItem = ({ key, value }: { key: string, value: string }): void => {
      const message: TLocalStorageSetItemRequest = {
         service: "localStorage",
         type: "setItemRequest",
         key,
         value
      };
      // eslint-disable-next-line no-undef
      postMessage(message);
   };
}

export const localStorage_WorkerThread = new LocalStorage_WorkerThread();