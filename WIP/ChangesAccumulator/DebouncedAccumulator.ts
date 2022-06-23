import { debounce } from 'lodash-es';

import type { IChangesAccumulator, WatchParams } from "./IChangesAccumulator.js";

export class DebouncedAccumulator implements IChangesAccumulator {
   private debounceMs: number;

   constructor(milliseconds: number = 2_000) {
      this.debounceMs = milliseconds;
   }

   public watch = (params: WatchParams) => {
      const { watcher, globsToWatch, filesChangedCallback } = params;

      const debouncedCallback = debounce(
         filesChangedCallback,
         this.debounceMs,
         { leading: false, trailing: true }
      )

      const changedFiles: string[] = [];

      const onFileChanged = (filepath: string) => {
         if(!changedFiles.includes(filepath)) {
            changedFiles.push(filepath);
            debouncedCallback(changedFiles);
         }
      }

      watcher.watch({ globsToWatch, fileChangedCallback: onFileChanged });
   }
}
