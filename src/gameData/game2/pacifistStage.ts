import { wait } from "../utils";

const sinusLeft = {
   type: "spawn", enemy: "sinus",
   x: 75,
   y: -20,
};

const sinusRight = {
   type: "spawn", enemy: "sinus",
   x: 280,
   y: -20,
   actions: [
      { type: "setAttribute", attribute: "right", value: true }
   ],
};

const sinuses = {
   repeat: 5,
   actions: [
      { do: [sinusLeft, wait(70)] },
      { do: [sinusRight, wait(70)] },
   ],
};

export const pacifistStage = {
   name: "pacifistStage",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      { wait: 120 },
      sinuses,
   ],
};
