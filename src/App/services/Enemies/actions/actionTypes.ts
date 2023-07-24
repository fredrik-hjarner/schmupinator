import type { Vector } from "../../../../math/bezier";
import type { TGraphicsActionWithoutHandle } from "../../Graphics/IGraphics";
import type { TAttrName, TAttrValue } from "../../Attributes/IAttributes";

/**
 * Action type enum.
 * It's often the best to have consts instead of strings. "Find all references" works better in IDE.
 * Enums are cool in one way: According to TS you are not allowed to assign a string to an enum,
 * so it forces you to use the enum everywhere which is great!
 */
export enum ActionType {
   wait = "wait",
   waitNextFrame = "waitNextFrame",
   waitUntilFrameNr = "wait_util_frame_nr",
   repeat = "repeat",
   shootDirection = "shootDirection",
   shootTowardPlayer = "shoot_toward_player",
   shoot_beside_player = "shoot_beside_player",
   setShotSpeed = "setShotSpeed",
   move = "move",
   moveDelta = "moveDelta",
   moveToAbsolute = "moveToAbsolute",
   set_position = "set_position",
   setSpeed = "setSpeed",
   rotate_around_absolute_point = "rotate_around_absolute_point",
   rotate_around_relative_point = "rotate_around_relative_point",
   parallelRace = "parallelRace",
   parallelAll = "parallelAll",
   rotate_towards_player = "rotate_towards_player",
   move_according_to_speed_and_direction = "move_according_to_speed_and_direction",
   spawn = "spawn",
   mirrorX = "mirrorX",
   mirrorY = "mirrorY",
   do = "do",
   despawn = "despawn",
   waitTilOutsideScreen = "waitTilOutsideScreen",
   waitTilInsideScreen = "waitTilInsideScreen",
   fork = "fork",
   setMoveDirection = "setMoveDirection",
   moveAccordingToInput = "moveAccordingToInput",
   waitInputShoot = "waitInputShoot",
   waitInputLaser = "waitInputLaser",
   finishLevel = "finishLevel",
   
   /**
    * Attributes
    */
   setAttribute = "setAttribute",
   attrIs = "attrIs",
   incr = "incr",
   decr = "decr",
   waitUntilAttrIs = "waitUntilAttrIs",
   
   /**
    * GFX
    */
   gfxSetPosition = "gfxSetPosition",
   gfxSetDiameter = "gfxSetDiameter",
   gfxSetColor = "gfxSetColor",
   gfxSetShape = "gfxSetShape",
   gfxSetRotation = "gfxSetRotation",
   gfxSetScale = "gfxSetScale",
   gfxScrollBg = "gfxScrollBg",
   gfxFillScreen = "gfxFillScreen",

   /**
    * GFX that is only used internally by the engine.
    */
   gfxAskForElement = "gfxAskForElement",
   gfxRelease = "gfxRelease",

   /**
    * Log
    */
   log = "log",
}

/**
 * Attribute getters.
 * Used to get the value of an attribute an inject that into an action that would otherwise take
 * a integer, float, bool, or string. This is to make stuff more dynamic and flexible.
 */
type TAttrGetter = Readonly<{ gameObjectId?: string, attr: TAttrName }>;

/**
 * Types for primitive values.
 * Instead of using "bool" use TBool (etc) so that an action can either take a hardcoded value
 * or get the value from an attribute.
 */
export type TNumber = Readonly<number | TAttrGetter>;
export type TString = Readonly<string | TAttrGetter>;
export type TBool = Readonly<boolean | TAttrGetter>;

/** Action types */
export type TWait =                Readonly<{ type: ActionType.wait, frames: TNumber }>;
export type TWaitNextFrame =       Readonly<{ type: ActionType.waitNextFrame }>;
export type TWaitUtilFrameNr =     Readonly<{ type: ActionType.waitUntilFrameNr, frameNr: number}>;
export type TRepeat =              Readonly<{ type: ActionType.repeat,
                                                times: TNumber, actions: TAction[] }>;
export type TShootDirection =      Readonly<{ type: ActionType.shootDirection,
                                                x: number, y: number }>;
export type TShootTowardPlayer =   Readonly<{ type: ActionType.shootTowardPlayer }>;
export type TShootBesidePlayer =   Readonly<{ type: ActionType.shoot_beside_player,
                                                degrees: number }>;
export type TSetShotSpeed =        Readonly<{ type: ActionType.setShotSpeed,
                                                pixelsPerFrame: number }>;
// Moves relative to current position.
export type TMove =                Readonly<{ type: ActionType.move,
                                                frames: number } & Partial<Vector>>;
// A very atomic action.
export type TMoveDelta =           Readonly<{ type: ActionType.moveDelta, x?: number, y?: number }>
// Move to an absolute postion on screen.
export type TMoveToAbsolute =      Readonly<{ type: ActionType.moveToAbsolute,
                                                moveTo: Partial<Vector>, frames: number }>;
export type TSetPosition =         Readonly<{ type: ActionType.set_position,
                                                x: number, y: number }>;
export type TSetSpeed =            Readonly<{ type: ActionType.setSpeed, pixelsPerFrame: number }>;
export type TRotateAroundAbsolutePoint = Readonly<{
   type:ActionType.rotate_around_absolute_point, point:Partial<Vector>, degrees:number,frames:number
}>;
export type TRotateAroundRelativePoint = Readonly<{
   type:ActionType.rotate_around_relative_point, point:Partial<Vector>, degrees:number,frames:number
}>
/**
 * Like Promise.race.
 * Executes TAction lists in parallel, stops when any one of them has finished.
 */
export type TparallelRace       = Readonly<{ type: ActionType.parallelRace,
                                                actionsLists: TAction[][] }>;
export type TparallelAll        = Readonly<{ type: ActionType.parallelAll,
                                                actionsLists: TAction[][] }>;
export type TRotateTowardsPlayer = Readonly<{ type: ActionType.rotate_towards_player }>;
export type TMoveAccordingToSpeedAndDirection =
                                       { type: ActionType.move_according_to_speed_and_direction };
// Spawns an enemy. actions are prepended to the actions of the particular enemy.
export type TSpawn = {
   type: ActionType.spawn, enemy: string, x?: number, y?: number, actions?: TAction[]
};
// Simple if-equals case. Executes yes if true. Executs no when false.
export type TAttrIs = {
   type: ActionType.attrIs, gameObjectId?: string, attrName: TAttrName,
   is: TAttrValue, yes?: TAction[], no?: TAction[]
};
// Increments an attribute. Obviously will blow up if trying to increment a non-number.
export type TIncrement =
{ type: ActionType.incr, gameObjectId?: string, attribute: TAttrName };
// Decrements an attribute. Obviously will blow up if trying to increment a non-number.
export type TDecrement =
{ type: ActionType.decr, gameObjectId?: string, attribute: TAttrName };

/**
 * Mirroring mirrors an axis.
 * If you have an enemy that moves like another enemy, except
 * that every x movement is inverted then try mirrorX.
 */
export type TMirrorX = { type: ActionType.mirrorX, value: boolean };
export type TMirrorY = { type: ActionType.mirrorY, value: boolean };
/**
 * The only purpose for this is to "flatten" arrays in YAML.
 * The action simple executes the actions sent to it. As simple as that.
 */
export type TDo = { type: ActionType.do, acns: TAction[] };
/**
 * Enemy despawns.
 * An example of when this should be used is when an enemy despawns outside of the screen,
 */
export type TDespawn = { type: ActionType.despawn };
/**
 * Attributes can be either some predefined thing by me such as hp, points,
 * or it could be  end-user specified variable with any type.
 */
export type TSetAttribute =
   { type: ActionType.setAttribute, gameObjectId?: string, attribute: TAttrName, value: TAttrValue};
/**
 * Waits until Enemy is outside the screen/game window.
 * margin is how many pixels the GameObject needs to be outside the screen.
 */
export type TWaitTilOutsideScreen = { type: ActionType.waitTilOutsideScreen, margin?: number };
// Waits until Enemy is inside the screen/game window
export type TWaitTilInsideScreen = { type: ActionType.waitTilInsideScreen };
/**
 * Fork is like fork in C essentially. The actions in fork executes separately
 * (in a separate generator) i.e. these actions won't delay other actions.
 * Usually you can get the same behaviour with `paralllelAll`/`parallelRace` but in some situations
 * the parallel actions aren't really an option (such as when you prepend actions when spawning
 * a new enemy and you want those actions to not delay the enemy's own actions, but rather
 * execute in parallel to them).
 */
export type TFork = { type: ActionType.fork, actions: TAction[] };
/**
 * Set only the move direction. Only specific some move actions care about the direction which 
 * gotta be called to move in the direction set with this action.
 */
export type TMoveDirection = Readonly<{ type: ActionType.setMoveDirection, degrees: number }>;
// Yields until the attribute has the value set in is.
export type TWaitUntilAttrIs = Readonly<{
   type: ActionType.waitUntilAttrIs, gameObjectId?: TString, attr: TAttrName, is: TAttrValue
}>;

/**
 * This action is a way to react to input/gamepad/controls, mainly made in order
 * to allow the Player to be an Enemy (i.e. GameObject)
 */
export type TMoveAccordingToInput = Readonly<{ type: ActionType.moveAccordingToInput }>;
export type TWaitInputShoot = Readonly<{ type: ActionType.waitInputShoot }>;
export type TWaitInputLaser = Readonly<{ type: ActionType.waitInputLaser }>;

// Signals that the level has been finished, so trigger this when end boss dies or something similar
export type TFinishLevel = Readonly<{ type: ActionType.finishLevel }>;

// Action to console.log, so you can debug actions.
export type TLog = Readonly<{ type: ActionType.log, msg: string }>;

export type TAction = Readonly<
   /**
    * Utils
    */
   TWait |
   TWaitNextFrame| 
   TWaitUtilFrameNr |
   TRepeat |
   TparallelRace |
   TparallelAll |
   TDo |
   TFork |
   /**
   * Shooting
   */
   TSetShotSpeed |
   TShootDirection |
   TShootTowardPlayer |
   TShootBesidePlayer |
   /**
   * Movement
   */
   TMove |
   TMoveDelta |
   TMoveToAbsolute |
   TSetPosition |
   TSetSpeed |
   TRotateAroundAbsolutePoint |
   TRotateAroundRelativePoint |
   TRotateTowardsPlayer |
   TMoveAccordingToSpeedAndDirection |
   TMoveDirection |
   /**
    * Controls/input
    */
   TMoveAccordingToInput |
   TWaitInputShoot |
   TWaitInputLaser |
   /**
   * Spawning/Life cycle
   */
   TSpawn |
   TDespawn |
   TWaitTilOutsideScreen |
   TWaitTilInsideScreen |
   /**
    * Control/Conditions/Attributes
    */
   TAttrIs |
   TSetAttribute |
   TIncrement |
   TDecrement |
   TWaitUntilAttrIs |
   TFinishLevel |
   /**
    * Mirroring
    */
   TMirrorX |
   TMirrorY |
   /**
    * And also all Graphics actions
    * I remove the handles because the enemy that executes the actions has the handle already.
    */
   TGraphicsActionWithoutHandle |
   /**
    * Log
    */
   TLog
>;
