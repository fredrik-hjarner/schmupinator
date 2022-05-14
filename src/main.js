import { playerSpeedPerFrame, resolutionHeight, resolutionWidth } from './consts.js';
import { Input } from './input.js';
import { px } from './utils.js';

const input = new Input();

let player = {
  position: {
    x: 100,
    y: 100
  },
  radius: 20
}

const initGameDiv = () => {
  const gameDiv = window.document.querySelector("#game")
  gameDiv.style.height = `${resolutionHeight}px`;
  gameDiv.style.width = `${resolutionWidth}px`;
  gameDiv.style.backgroundColor = "lightgray";
  gameDiv.style.position = "fixed";
  gameDiv.style.top = "0px";
  gameDiv.style.left = "0px";
  return gameDiv;
}

const initFrameCounterDiv = () => {
  const frameCounter = window.document.querySelector("#frameCounter")
  frameCounter.style.position = "fixed";
  frameCounter.style.top = px(resolutionHeight);
  frameCounter.style.left = "0px";
  return frameCounter;
}

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

window.onload = () => {
  console.log("Start");

  const game = initGameDiv();

  const framCounter = initFrameCounterDiv();

  const playerDiv = initPlayerDiv();

  let start;
  let frames = 0;
  function step(millis) {
    if (!start) start = millis;
    const totalMillis = millis - start;

    frames++;
    frameCounter.innerHTML = frames

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

    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
};
