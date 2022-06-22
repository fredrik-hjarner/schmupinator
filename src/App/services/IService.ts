import type { App } from "../App";

export interface IService {
  app: App;
  name: string;
  // Create: () => Promise<IService>
  /**
   * 2nd phase of initialization.
   * Here you are allowed to use other services (that are deps),
   * because you know they have initialized.
   */
  Init: () => Promise<void>
  // Destroy: () => void
}
