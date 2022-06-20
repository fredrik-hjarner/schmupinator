export interface IBrowserDriver {
   WithWindow(callback: (window: Window) => unknown): unknown;

   Alert(message: string): void;

   // eslint-disable-next-line no-undef
   OnLoad(callback: () => void): unknown;

   PerformanceNow(): number;

   SetInterval(callback: () => void, ms: number): number;

   Fetch(input: string): Promise<string>;
}
