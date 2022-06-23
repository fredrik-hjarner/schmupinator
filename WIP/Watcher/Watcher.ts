import type { IWatcher, WatchParams } from './IWatcher.js';

import { watch } from 'chokidar';

export class Watcher implements IWatcher {
   public watch = (params: WatchParams) => {
      const { globsToWatch, fileChangedCallback } = params;
      
      const onError = (error: Error) => {
         console.error(error.message);
      };

      watch(globsToWatch, { ignoreInitial: true })
         .on('error', onError)
         // @ts-ignore
         .on('all', (event, filepath) => {
            fileChangedCallback(filepath);
         });
   }
};
