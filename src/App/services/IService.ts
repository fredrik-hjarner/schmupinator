import type { App } from "../App";

export interface IService {
  app: App;
  name: string;
  // Init: () => Promise<void>
  // Destroy: () => void
}
