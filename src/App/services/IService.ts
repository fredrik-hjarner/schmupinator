export type TInitParams = Partial<{ [serviceName: string]: IService }>;

export interface IService {
  name: string;
  // Create: () => Promise<IService>
  /**
   * 2nd phase of initialization.
   * Here you are allowed to use other services (that are deps),
   * because you know they have initialized.
   */
  Init: (deps?: TInitParams) => Promise<void>
  // Destroy: () => void
}
