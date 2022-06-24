export interface IBrowserDriver {
   WithWindow(callback: (window: Window) => unknown): unknown;

   Alert(message: string): void;

   OnLoad(callback: () => void): unknown;

   PerformanceNow(): number;

   SetInterval(callback: () => void, ms: number): number;

   FetchText(input: string): Promise<string>;

   // eslint-disable-next-line no-undef
   FetchBinary(path: string): Promise<Buffer | Blob>;
}
