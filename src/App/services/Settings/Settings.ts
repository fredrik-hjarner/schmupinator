import type { IService, TInitParams } from "../IService";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { App } from "../../App";

const localStorageKey = "__settings";

type TSettings = {
   fullscreen: boolean,
};

type TConstructor = {
   app: App;
   name: string,
}

export type TQualifiedForTop10 = {
   qualifiedForTop10: boolean;
   rank?: number;
}

export class Settings implements IService {
   public readonly name: string;
   public settings: TSettings = {
      fullscreen: true,
   };

   // deps/services
   //@ts-ignore: TODO: I inted to use app to replace services without location.reload().
   private app: App;

   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      // attempt to load from localStorage.
      BrowserDriver.WithWindow(window => {
         const fromLocalStorage = window.localStorage.getItem(localStorageKey);
         if(fromLocalStorage) {
            // console.log("Settings.Init: fromLocalStorage:");
            // console.log(fromLocalStorage);
            this.settings = JSON.parse(fromLocalStorage) as TSettings;
         } else {
            // If not in localStorage then save the default in localStorage.
            // console.log(
            //    "Settings.Init: localStorage was empty. saving default settings to localStorage."
            // );
            window.localStorage.setItem(localStorageKey, JSON.stringify(this.settings));
         }
      });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (_deps?: TInitParams) => {
      // noop
   };

   // Send in whatever settings you want to change/update, rest is unchanged.
   public updateSettings = (settings: Partial<TSettings>) => {
      Object.entries(settings).forEach(([k, v]) => {
         const typedK = k as keyof TSettings;
         if(v !== undefined) {
            if(typedK === "fullscreen") {
               // TODO: Switch Fullscreen servive here.
            }
            this.settings[typedK as keyof TSettings] = v;
         }
      });

      // Write settings of this object to localStorage.
      BrowserDriver.WithWindow(window => {
         window.localStorage.setItem(localStorageKey, JSON.stringify(this.settings));
      });

      // TODO: reload just because app does not clear up by itself yet.
      BrowserDriver.WithWindow(window => {
         window.location.reload();
      });
   };
}