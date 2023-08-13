import type {
   TLocalStorageGetItemRequest,
   TLocalStorageGetItemResponse,
   TLocalStorageSetItemRequest
} from "../types";

import { port } from "@/workerThread.ts";

export class LocalStorage_WorkerThread {
   public getItem = async (key: string): Promise<TLocalStorageGetItemResponse["value"]> => {
      const message: TLocalStorageGetItemRequest = {
         service: "localStorage",
         type: "getItemRequest",
         key
      };
      // console.log("port", port);
      port.postMessage(message);
      return new Promise((resolve, reject) => {
         port.onmessage = (ev) => {
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
      port.postMessage(message);
   };
}

export const localStorage_WorkerThread = new LocalStorage_WorkerThread();