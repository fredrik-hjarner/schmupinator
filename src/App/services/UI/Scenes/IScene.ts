import type { IUI } from "../IUI";

export interface IScene {
   ui: IUI;
   // Allows to send in whatever. Has to be typechecked afterwards.
   render(props?: unknown): void
   destroy(): void
}
