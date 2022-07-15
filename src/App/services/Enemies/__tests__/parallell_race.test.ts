import type { TAction } from '../actionTypes';
import type { Vector as TVector } from '../../../../math/bezier';

import { EnemyActionExecutor } from '../EnemyActionExecutor';

const getAttr = (_: string) => false;
//@ts-ignore
const input: any = undefined;
//@ts-ignore
const gamepad: any = undefined;

describe("parallelRace", () => {
  const getPosition = (): TVector => ({ x: 0, y: 0 });

  it("empty actions list. exect no exception. expect done", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      getAttr,
      input,
      gamepad,
      actions: [{
        parallelRace: [[]]
      }]
    }).generators[0];

    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(0);
  });

  it("One empty action list. Expect no recordedActions. Expect immediate done.", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      getAttr,
      input,
      gamepad,
      actions: [{
        parallelRace: [
          [],
          [{ setSpeed: 1 }]
        ]
      }]
    }).generators[0];

    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(1);
  });

  it("Expect shorter list to shortcut", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      getAttr,
      input,
      gamepad,
      actions: [{
        parallelRace: [[
          { setSpeed: 1 }
        ], [
          { type: 'waitNextFrame' },
          { setSpeed: 1 }
        ]]
      }]
    }).generators[0];

    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(1);
  });

  it("Expect shorter list to shortcut. Test2", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      getAttr,
      input,
      gamepad,
      actions: [{
        parallelRace: [[
          { type: 'waitNextFrame' },
          { setSpeed: 1 }
        ], [
          { type: 'waitNextFrame' },
          { type: 'waitNextFrame' },
          { setSpeed: 1 }
        ]]
      }]
    }).generators[0];

    expect(generator.next().done).toBe(false);
    expect(recordedActions.length).toBe(0);
    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(1);
  });
});

export { }