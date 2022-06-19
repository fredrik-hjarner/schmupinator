import { BrowserDriver } from "../drivers/BrowserDriver";

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
   // eslint-disable-next-line no-undef
   return value instanceof window.HTMLDivElement;
};
