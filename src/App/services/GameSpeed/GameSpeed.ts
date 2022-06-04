import type { App } from "../../App";
import type { IService } from "../IService";

import { initGameSpeedElement } from "./gameSpeedElement";

type TConstructor = {
  app: App;
  name: string;
}

export class GameSpeed implements IService {
  app: App;
  name: string;
  gameSpeedElement: HTMLInputElement;

  /**
   * Public
   */
  constructor({ app, name }: TConstructor) {
    this.app = app;
    this.name = name;
    this.gameSpeedElement = initGameSpeedElement();
  }

  // nr of frames per 1/60 seconds.
  public get GameSpeed() {
    const value = this.gameSpeedElement.value;
    return parseInt(value, 10);
  }
}
