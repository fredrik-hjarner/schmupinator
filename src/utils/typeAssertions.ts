export const isNumber = (value: unknown): value is number => {
   return typeof value === "number";
};
export const assertNumber = (value: unknown): number => {
   if(!isNumber(value)) {
      const error = `assertNumber: ${JSON.stringify(value)} is not of type "number"`;
      alert(error);
      throw new Error(error);
   }
   return value;
};