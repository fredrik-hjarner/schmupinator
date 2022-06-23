import type { IWatcher, WatchParams } from './IWatcher';

import { watch } from 'chokidar';

export const Watcher: IWatcher = {
   watch: (params: WatchParams) => {
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
