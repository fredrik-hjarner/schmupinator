import type { IEnemyJson } from "../IEnemyJson";

/**
 * The "spawner" enemy is not a normal enemy.
 * It can do everything that an enemy can do, but it's
 * primary purpose is to auto-spawn at [0, 0] and
 * be resposible for spawning enemies.
 */
export const spawner: IEnemyJson = {
   name: "spawner",
   diameter: 20,
   hp: 9999,
   actions: [
      { wait: 120 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 40 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 40 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 40 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 40 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 40 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 40 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 40 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 128.5, y: -22 },
      { type: 'spawn', enemy: 'nonShootingAimer', x: 228.5, y: -22 },
      { wait: 160 },
      { type: 'spawn', enemy: 'sinusLeft', x: 75, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusRight', x: 280, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusLeft', x: 75, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusRight', x: 280, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusLeft', x: 75, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusRight', x: 280, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusLeft', x: 75, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusRight', x: 280, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusLeft', x: 75, y: -20 },
      { wait: 70 },
      { type: 'spawn', enemy: 'sinusRight', x: 280, y: -20 },
      { wait: 250 },
      { type: 'spawn', enemy: 'firstMiniboss1', x: 118.881, y: -20 },
      { type: 'spawn', enemy: 'firstMiniboss2', x: 237.762, y: -20 }
   ]
};
