import { millisPerFrame, playerSpeedPerFrame, resolutionHeight, resolutionWidth } from './consts.js';
import { initElapsedTimeDiv } from './elapsedTimeDiv.js';
import { initFpsDiv } from './fpsDiv.js';
import { initFrameCounterDiv } from './frameCounterDiv.js';
import { initGameDiv } from './gameDiv.js';
import { Input } from './input.js';
import { px } from './utils.js';

/**
 * Variables
 */
const input = new Input();
let player = { position: { x: 100, y: 100 }, radius: 20 };
let framCount = 0;
const gameDiv = initGameDiv();
const framCounterDiv = initFrameCounterDiv();
const elapsedTimeDiv = initElapsedTimeDiv();
const fpsDiv = initFpsDiv();
let nextFrameMillis = null;

/**
 * Functions
 */
const initPlayerDiv = () => {
  const playerDiv = window.document.querySelector("#player")
  playerDiv.style.position = "fixed";
  playerDiv.style.backgroundColor = "blue";
  playerDiv.style.width = `${player.radius}px`;
  playerDiv.style.height = `${player.radius}px`;
  playerDiv.style.top = `${player.position.y}px`;
  playerDiv.style.left = `${player.position.x}px`;
  playerDiv.style.borderRadius = "5000px";
  return playerDiv;
}
const playerDiv = initPlayerDiv()

const updatePlayer = () => {
  const speed = playerSpeedPerFrame[0];

  if(input.buttonsPressed.left) {
    player.position.x -= speed;
  }
  if(input.buttonsPressed.right) {
    player.position.x += speed;
  }
  if(input.buttonsPressed.up) {
    player.position.y -= speed;
  }
  if(input.buttonsPressed.down) {
    player.position.y += speed;
  }

  playerDiv.style.top = `${player.position.y}px`;
  playerDiv.style.left = `${player.position.x}px`;
}

const nextFrame = () => {
  framCount++;
  updatePlayer();
  const now = performance.now();
  elapsedTimeDiv.innerHTML = `elapsed: ${now}ms`;
  framCounterDiv.innerHTML = `frames: ${framCount}`;
  fpsDiv.innerHTML = `frames: ${Math.round(framCount/(now/1000))}`;
}

/**
 * This may not actually progress the game one frame.
 * Idea is to run these as fast as possible and to only progress a frame
 * when one frame has passed.
 */
const oneGameLoop = () => {
  while(performance.now() >= nextFrameMillis) {
    nextFrameMillis += millisPerFrame;
    nextFrame();
  }
}

window.onload = () => {
  console.log("Start");
  nextFrameMillis = performance.now();
  setInterval(oneGameLoop, 0);
};
