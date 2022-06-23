import type { IWatcher } from "../Watcher/IWatcher";

type WatchParams = {
   watcher: IWatcher;
   globsToWatch: string;
   filesChangedCallback: (filepaths: string[]) => void;
};

interface IChangesAccumulator {
   watch(params: WatchParams): void;
}

export const ChangesAccumulator: IChangesAccumulator = {
   watch: (params: WatchParams) => {
      const { watcher, globsToWatch, filesChangedCallback } = params;

      const changedFiles: string[] = [];

      const onFileChanged = (filepath: string) => {
         if(!changedFiles.includes(filepath)) {
            changedFiles.push(filepath);
            filesChangedCallback(changedFiles);
         }
      }

      watcher.watch({ globsToWatch, fileChangedCallback: onFileChanged });
   }
}
