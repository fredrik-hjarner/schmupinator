import type { IWatcher } from "../Watcher/IWatcher";

export type WatchParams = {
   watcher: IWatcher;
   globsToWatch: string;
   filesChangedCallback: (filepaths: string[]) => void;
};

export interface IChangesAccumulator {
   watch(params: WatchParams): void;
}