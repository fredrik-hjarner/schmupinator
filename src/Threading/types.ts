
/**
 * localStorage
 */

export type TLocalStorageGetItemRequest = {
   service: "localStorage";
   type: "getItemRequest";
   key: string;
};

export type TLocalStorageGetItemResponse = {
   service: "localStorage";
   type: "getItemResponse";
   value: string | null;
};

export type TLocalStorageSetItemRequest = {
   service: "localStorage";
   type: "setItemRequest";
   key: string;
   value: string;
};

/**
 * For MainThread onmessage
 */

export type Requests =
   TLocalStorageGetItemRequest |
   TLocalStorageSetItemRequest;