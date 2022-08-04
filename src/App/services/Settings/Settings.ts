import type { IService, TInitParams } from "../IService";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { App } from "../../App";

const localStorageKey = "__settings";

type TSettings = {
   fullscreen: boolean;
   gameSpeedSlider: boolean;
   fpsStats: boolean;
   outsideHider: boolean;
   /** If pre-recorded inputs should be used instead of manula input from player. */
   autoplay: boolean;
   skipStartMenu: boolean;
};

type TConstructor = {
   app: App;
   name: string,
}

export class Settings implements IService {
   public readonly name: string;
   public settings: TSettings = {
      fullscreen: true,
      gameSpeedSlider: false,
      fpsStats: false,
      outsideHider: true,
      autoplay: false,
      skipStartMenu: false,
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

   public toggleSetting = (setting: keyof TSettings) => {
      const oldValue = this.settings[setting];
      this.settings[setting] = !oldValue;
      if(setting === "fullscreen") {
         // TODO: Switch Fullscreen servive here.
      }

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