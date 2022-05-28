import type  { App } from "../../App.js";

import { millisPerFrame } from "../../../consts.js";
import { round } from "../../../utils/round.js";
import { initElapsedTimeDiv } from "./elapsedTimeDiv.js";
import { initFpsDiv } from "./fpsDiv.js";
import { initFrameCounterDiv } from "./frameCounterDiv.js";

type Listeners = {
  [key: string]: () => void
}

export class GameLoop {
  app: App;
  FrameCount: number;
  framCounterDiv: HTMLDivElement;
  elapsedTimeDiv: HTMLDivElement;
  fpsDiv: HTMLDivElement;
  nextFrameMillis: number | null;
  listeners: Listeners;
  startTime: number | null;

  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;

    this.FrameCount = 0;
    this.framCounterDiv = initFrameCounterDiv();
    this.elapsedTimeDiv = initElapsedTimeDiv();
    this.fpsDiv = initFpsDiv();
    this.nextFrameMillis = null;
    this.listeners = {}; // key-callback pairs
    this.startTime = null;
  }

  Start = () => {
    this.startTime = performance.now();
    this.nextFrameMillis = performance.now() + millisPerFrame;
    setInterval(this.oneGameLoop, 0);
  };

  SubscribeToNextFrame = (key: string, callback: () => void) => {
    this.listeners[key] = callback;
  };

  UnsubscribeToNextFrame = (key: string) => {
    delete this.listeners[key];
  };

  /**
   * Private
   */
  nextFrame = () => {
    this.FrameCount++;
    Object.values(this.listeners).forEach(callback => {
      callback();
    });
    // Display stats.
    const elapsed = performance.now() - this.startTime;
    this.elapsedTimeDiv.innerHTML = `elapsed: ${round(elapsed/1000)}s`;
    this.framCounterDiv.innerHTML = `frames: ${this.FrameCount}`;
    this.fpsDiv.innerHTML = `fps: ${Math.round(this.FrameCount / (elapsed / 1000))}`;
  };

  /**
   * This may not actually progress the game one frame.
   * Idea is to run these as fast as possible and to only progress a frame
   * when one frame has passed.
   */
  oneGameLoop = () => {
    while (performance.now() >= this.nextFrameMillis) {
      this.nextFrameMillis += millisPerFrame;
      this.nextFrame();
    }
  };
}