import type { App } from "../../../App";
import type { IUI } from "../IUI";

export interface IScene {
   app: App;
   ui: IUI;
   render(): void
   destroy(): void
}
