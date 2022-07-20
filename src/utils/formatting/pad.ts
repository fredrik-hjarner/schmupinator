/**
 * Pad with space
 */
export const pad = (text: string, length: number) => {
   const padLentgh = length - text.length;
   const spaces = Array(padLentgh).fill(" ").join("");
   return `${text}${spaces}`;
};