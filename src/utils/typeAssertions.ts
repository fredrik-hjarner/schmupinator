import { BrowserDriver, IsBrowser } from "../drivers/BrowserDriver";

export const isNumber = (value: unknown): value is number => {
   return typeof value === "number";
};
export const assertNumber = (value: unknown): number => {
   if(!isNumber(value)) {
      const error = `assertNumber: ${JSON.stringify(value)} is not of type "number"`;
      BrowserDriver.Alert(error);
      throw new Error(error);
   }
   return value;
};

export const isHTMLDivElement = (value: unknown): value is HTMLDivElement => {
   if(!IsBrowser()) {
      return false;
   }
   // eslint-disable-next-line no-undef
   return value instanceof window.HTMLDivElement;
};

export const isHTMLInputElement = (value: unknown): value is HTMLInputElement => {
   if(!IsBrowser()) {
      return false;
   }
   // eslint-disable-next-line no-undef
   return value instanceof window.HTMLInputElement;
};
