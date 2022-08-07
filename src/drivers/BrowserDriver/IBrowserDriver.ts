export interface IBrowserDriver {
   WithWindow: <T>(callback: (window: Window) => T) => T | undefined;

   Alert(message: string): void;

   OnLoad(callback: () => void): unknown;

   PerformanceNow(): number;

   SetInterval(callback: () => void, ms: number): number;

   RequestAnimationFrame: (callback: (time: number) => void) => number

   FetchText(input: string): Promise<string>;

   // eslint-disable-next-line no-undef
   FetchBinary(path: string): Promise<Buffer | Blob>;
}
