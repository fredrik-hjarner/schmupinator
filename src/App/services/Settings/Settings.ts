import type { IService, TInitParams } from "../IService";
import type { App } from "../../App";

import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { localStorage_WorkerThread } from "@/Threading/LocalStorage/LocalStorage_WorkerThread.ts";

const localStorageKey = "__settings";

export type TSettings = {
   fullscreen: boolean;
   gameSpeedSlider: boolean;
   fpsStats: boolean;
   outsideHider: boolean;
   /** If pre-recorded inputs should be used instead of manual input from player. */
   autoplay: boolean;
   skipStartMenu: boolean;
   invincibility: boolean;
};

const defaultSettings: TSettings = {
   fullscreen: true,
   gameSpeedSlider: false,
   fpsStats: false,
   outsideHider: true,
   autoplay: false,
   skipStartMenu: false,
   invincibility: false,
};

type TCreate = {
   getApp: () => App;
   name: string,
}

type TConstructor = {
   getApp: () => App;
   name: string;
   settings: TSettings;
}

export class Settings implements IService {
   public readonly name: string;
   public settings: TSettings = defaultSettings;

   // deps/services
   // TODO: I intend to use app to replace services without location.reload().

   /**
    * The reason why this is not `app` but `getApp` is because I couldnt
    * figure out how to get the app instance in the Settings constructor, it was hard
    * to get the order of initialization right.
    * I all stems from Settings needing to be created first because it deteminess what
    * variant other services should be etc. And Settings constructor needed to be async
    * because it calls localStorage on main thread from from WebWorker.
    */
   private getApp: () => App;

   /**
    * Settings constructor needed to be async which caused a lot of pain...
    */
   public static create = async ({ getApp, name }: TCreate) => {
      // attempt to load from localStorage.
      const fromLocalStorage = await localStorage_WorkerThread.getItem(localStorageKey);

      let settings = defaultSettings;

      console.log("Settings.Init: fromLocalStorage:", fromLocalStorage);

      if(fromLocalStorage) {
         // console.log("Settings.Init: fromLocalStorage:");
         // console.log(fromLocalStorage);
         settings = JSON.parse(fromLocalStorage) as TSettings;
         console.log("Settings.Init: this.settings:", settings);
      } else {
         localStorage_WorkerThread.setItem({
            key: localStorageKey,
            value: JSON.stringify(settings),
         });
      }
      return new Settings({ getApp, name, settings });
   };

   public constructor({ getApp, name, settings }: TConstructor) {
      this.getApp = getApp;
      this.name = name;
      this.settings = settings;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (_deps?: TInitParams) => {
      // noop
   };

   public toggleSetting = (setting: keyof TSettings) => {
      const oldValue = this.settings[setting];
      this.settings[setting] = !oldValue;

      // Write settings of this object to localStorage.
      // BrowserDriver.WithWindow(window => {
      //    window.localStorage.setItem(localStorageKey, JSON.stringify(this.settings));
      // });
      localStorage_WorkerThread.setItem({
         key: localStorageKey,
         value: JSON.stringify(this.settings),
      });

      // TODO: reload just because app does not clear up by itself yet.
      BrowserDriver.WithWindow(window => {
         // Some settings need to reload the window for changes to apply.
         switch(setting) {
            case "fpsStats":
               this.getApp().fps.destroy();
               this.getApp().fps = this.getApp().construct.fps();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.getApp().init.fps(); // TODO: Warning this is a Promise.
               break;
            case "fullscreen":
               /**
                * TODO: This is not optimal. I would need lots of smart code to do this well.
                * TODO: Create a this.app.restart/reload to shorten the code here.
                */
               this.getApp().fullscreen.destroy();
               this.getApp().fullscreen = this.getApp().construct.fullscreen();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.getApp().init.fullscreen(); // TODO: Warning this is a Promise.
               break;
            case "gameSpeedSlider":
               this.getApp().gameSpeed.destroy();
               this.getApp().gameSpeed = this.getApp().construct.gameSpeed();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.getApp().init.gameSpeed(); // TODO: Warning this is a Promise.
               break;
            case "outsideHider":
               this.getApp().outsideHider.destroy();
               this.getApp().outsideHider = this.getApp().construct.outsideHider();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.getApp().init.outsideHider(); // TODO: Warning this is a Promise.
               break;
            case "skipStartMenu":
               // TODO: Do I need to do something here? Maybe restart UI service?
               break;
            default:
               window.location.reload();
               break;
         }
      });
   };
}