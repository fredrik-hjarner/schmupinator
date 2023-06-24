import { col, row } from "./common";

const makeEasyFlyer = ({ x = col[1], y = -30}: { x?: number, y?: number}) => ({
   spawn: "easyFlyer",
   x,
   y,
});

// const wave1 = [
//    makeEasyFlyer({ x: col[5] }),
//    { type: "wait", frames: 90 },
//    makeEasyFlyer({ x: col[4] }),
//    makeEasyFlyer({ x: col[6] }),
//    { type: "wait", frames: 90 },
//    makeEasyFlyer({ x: col[3] }),
//    makeEasyFlyer({ x: col[7] }),
//    { type: "wait", frames: 90 },
//    makeEasyFlyer({ x: col[2] }),
//    makeEasyFlyer({ x: col[5] }),
//    makeEasyFlyer({ x: col[8] }),
//    { type: "wait", frames: 90 },
//    makeEasyFlyer({ x: col[1] }),
//    makeEasyFlyer({ x: col[4] }),
//    makeEasyFlyer({ x: col[6] }),
//    makeEasyFlyer({ x: col[9] }),
// ];

// const wave2 = [
//    makeEasyFlyer({ x: col[4] }),
//    makeEasyFlyer({ x: col[5] }),
//    makeEasyFlyer({ x: col[6] }),
//    { type: "wait", frames: 60 },
//    { type: "repeat", times: 5, actions: [
//       { type: "wait", frames: 60 },
//       makeEasyFlyer({ x: col[0] }),
//       makeEasyFlyer({ x: col[1] }),
//       makeEasyFlyer({ x: col[2] }),
//       makeEasyFlyer({ x: col[3] }),
//       makeEasyFlyer({ x: col[4] }),
//       makeEasyFlyer({ x: col[5] }),
//       makeEasyFlyer({ x: col[6] }),
//       makeEasyFlyer({ x: col[7] }),
//       makeEasyFlyer({ x: col[8] }),
//       makeEasyFlyer({ x: col[9] }),
//       makeEasyFlyer({ x: col[10] }),
//    ]},
// ];

const wave3 = [
   { spawn: "easyFlyer", x: -100, y: 0, actions: [
      { type: "setMoveDirection", degrees: 140 }
   ] },
   { spawn: "easyFlyer", x: -50, y: -50, actions: [
      { type: "setMoveDirection", degrees: 135 }
   ] },
   { spawn: "easyFlyer", x: 0, y: -100, actions: [
      { type: "setMoveDirection", degrees: 135 }
   ] },
   { type: "wait", frames: 30 },
   { spawn: "easyFlyer", x: col[9], y: row[-1], actions: [
      { type: "setMoveDirection", degrees: -135 }
   ] },
   { spawn: "easyFlyer", x: col[10], y: row[0], actions: [
      { type: "setMoveDirection", degrees: -135 }
   ] },
   { spawn: "easyFlyer", x: col[11], y: row[1], actions: [
      { type: "setMoveDirection", degrees: -135 }
   ] },
   { type: "wait", frames: 60 },
];

const wave4 = [
   { type: "repeat", times: 5, actions: [
      makeEasyFlyer({ x: col[1], y: -20 }),
      makeEasyFlyer({ x: col[3], y: -20 }),
      makeEasyFlyer({ x: col[5], y: -20 }),
      makeEasyFlyer({ x: col[7], y: -20 }),
      makeEasyFlyer({ x: col[9], y: -20 }),
      { type: "wait", frames: 80 },
      makeEasyFlyer({ x: col[0], y: -20 }),
      makeEasyFlyer({ x: col[2], y: -20 }),
      makeEasyFlyer({ x: col[4], y: -20 }),
      makeEasyFlyer({ x: col[6], y: -20 }),
      makeEasyFlyer({ x: col[8], y: -20 }),
      makeEasyFlyer({ x: col[10], y: -20 }),
      { type: "wait", frames: 80 },
   ]},
];

export const stage4 = {
   name: "stage4",
   diameter: 20,
   hp: 9999,
   actions: [
      // - do: *wave1
      // - wait: 240
      // - do: *wave2
      // - wait: 240
      { type: "do", acns: wave3 },
      { type: "wait", frames: 240 },
      { type: "do", acns: wave4 },
   ],
};

export const easyFlyer = {
   name: "easyFlyer",
   diameter: 29,
   hp: 5,
   actions: [
      { type: "setSpeed", pixelsPerFrame: 1.17 },
      { type: "gfxSetColor", color: "green" },
      { forever: [
         { type: "move_according_to_speed_and_direction" },
         { type: "waitNextFrame" },
      ]},
   ],
};