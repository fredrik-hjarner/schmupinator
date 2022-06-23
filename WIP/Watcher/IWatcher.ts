export type WatchParams = {
   globsToWatch: string;
   fileChangedCallback: (filepath: string) => void;
};

export interface IWatcher {
   watch(params: WatchParams): void;
}