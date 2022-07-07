import type { IUI } from "../IUI";

export interface IScene {
   ui: IUI;
   render(): void
   destroy(): void
}
