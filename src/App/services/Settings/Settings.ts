import type { IService, TInitParams } from "../IService";
import type { App } from "../../App";

import { BrowserDriver } from "../../../drivers/BrowserDriver";

const localStorageKey = "__settings";

export type TSettings = {
   fullscreen: boolean;
   gameSpeedSlider: boolean;
   fpsStats: boolean;
   outsideHider: boolean;
   /** If pre-recorded inputs should be used instead of manula input from player. */
   autoplay: boolean;
   skipStartMenu: boolean;
   invincibility: boolean;
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
      invincibility: false,
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

      // Write settings of this object to localStorage.
      BrowserDriver.WithWindow(window => {
         window.localStorage.setItem(localStorageKey, JSON.stringify(this.settings));
      });

      // TODO: reload just because app does not clear up by itself yet.
      BrowserDriver.WithWindow(window => {
         // Some settings need to reload the window for changes to apply.
         switch(setting) {
            case "fpsStats":
               this.app.fps.destroy();
               this.app.fps = this.app.construct.fps();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.app.init.fps(); // TODO: Warning this is a Promise.
               break;
            case "fullscreen":
               /**
                * TODO: This is not optimal. I would need lots of smart code to do this well.
                * TODO: Create a this.app.restart/reload to shorten the code here.
                */
               this.app.fullscreen.destroy();
               this.app.fullscreen = this.app.construct.fullscreen();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.app.init.fullscreen(); // TODO: Warning this is a Promise.
               break;
            case "gameSpeedSlider":
               this.app.gameSpeed.destroy();
               this.app.gameSpeed = this.app.construct.gameSpeed();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.app.init.gameSpeed(); // TODO: Warning this is a Promise.
               break;
            case "outsideHider":
               this.app.outsideHider.destroy();
               this.app.outsideHider = this.app.construct.outsideHider();
               // eslint-disable-next-line @typescript-eslint/no-floating-promises
               this.app.init.outsideHider(); // TODO: Warning this is a Promise.
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