import type { TAction } from '../actionTypes';
import type { Vector as TVector } from '../../../../math/bezier';

import { EnemyActionExecutor } from '../EnemyActionExecutor';

describe("parallell_race", () => {
  const getPosition = (): TVector => ({ x: 0, y: 0 });

  it("empty actions list. exect no exception. expect done", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      actions: [{
        type: "parallell_race", actionsLists: [[]]
      }]
    }).generator;

    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(0);
  });

  it("One empty action list. Expect no recordedActions. Expect immediate done.", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      actions: [{
        type: "parallell_race", actionsLists: [
          [],
          [{ type: 'setSpeed', pixelsPerFrame: 1 }]
        ]
      }]
    }).generator;

    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(1);
  });

  it("Expect shorter list to shortcut", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      actions: [{
        type: "parallell_race", actionsLists: [[
          { type: 'setSpeed', pixelsPerFrame: 1 }
        ], [
          { type: 'waitNextFrame' },
          { type: 'setSpeed', pixelsPerFrame: 1 }
        ]]
      }]
    }).generator;

    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(1);
  });

  it("Expect shorter list to shortcut. Test2", () => {
    const recordedActions: TAction[] = [];
    const actionHandler = (action: TAction) => { recordedActions.push(action) };

    const generator = new EnemyActionExecutor({
      getPosition,
      actionHandler,
      actions: [{
        type: "parallell_race", actionsLists: [[
          { type: 'waitNextFrame' },
          { type: 'setSpeed', pixelsPerFrame: 1 }
        ], [
          { type: 'waitNextFrame' },
          { type: 'waitNextFrame' },
          { type: 'setSpeed', pixelsPerFrame: 1 }
        ]]
      }]
    }).generator;

    expect(generator.next().done).toBe(false);
    expect(recordedActions.length).toBe(0);
    expect(generator.next().done).toBe(true);
    expect(recordedActions.length).toBe(1);
  });
});
