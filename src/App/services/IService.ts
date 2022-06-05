import type { App } from "../App";

export interface IService {
  app: App;
  name: string;
  // Init: () => void
  // Destroy: () => void
}
