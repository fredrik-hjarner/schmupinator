import { wrap } from "comlink";

/**
 * TODO: Comment.
 */

let _remoteWindow: Window;

export const remoteWindow = {
   get: () => _remoteWindow,

   set: (port: MessagePort) => {
      // @ts-ignore
      _remoteWindow = wrap<Window>(port);
   }
};



