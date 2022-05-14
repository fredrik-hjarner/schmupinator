import { millisPerFrame } from "../consts.js";
import { initElapsedTimeDiv } from "./elapsedTimeDiv.js";
import { initFpsDiv } from "./fpsDiv.js";
import { initFrameCounterDiv } from "./frameCounterDiv.js";

export class GameLoop {
  /**
   * Public
   */
  constructor(app) {
    app = this.app;

    this.framCount = 0;
    this.framCounterDiv = initFrameCounterDiv();
    this.elapsedTimeDiv = initElapsedTimeDiv();
    this.fpsDiv = initFpsDiv();
    this.nextFrameMillis = null;
    this.listeners = {}; // key-callback pairs
  }

  Start = () => {
    this.nextFrameMillis = performance.now();
    setInterval(this.oneGameLoop, 0);
  }

  SubscribeToNextFrame = (key, callback) => {
    this.listeners[key] = callback;
  }

  UnsubscribeToNextFrame = (key) => {
    delete this.listeners[key];
  }

  /**
   * Private
   */
  nextFrame = () => {
    this.framCount++;
    Object.values(this.listeners).forEach(callback => {
      callback();
    })
    // Display stats.
    const now = performance.now();
    this.elapsedTimeDiv.innerHTML = `elapsed: ${now}ms`;
    this.framCounterDiv.innerHTML = `frames: ${this.framCount}`;
    this.fpsDiv.innerHTML = `frames: ${Math.round(this.framCount / (now / 1000))}`;
  }

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
  }
}