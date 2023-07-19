import type { Vector } from "../../../../math/bezier";
import type { TGraphicsActionWithoutHandle } from "../../Graphics/IGraphics";
import type { TAttrValue } from "../../Attributes/IAttributes";

export type TWait =                Readonly<{ type: "wait", frames: number }>;
export type TWaitNextFrame =       Readonly<{ type: "waitNextFrame" }>;
export type TWaitUtilFrameNr =     Readonly<{ type: "wait_util_frame_nr", frameNr: number}>;
export type TRepeat =              Readonly<{ type: "repeat", times: number, actions: TAction[] }>;
export type TShootDirection =      Readonly<{ type: "shootDirection", x: number, y: number }>;
export type TShootTowardPlayer =   Readonly<{ type: "shoot_toward_player" }>;
export type TShootBesidePlayer =   Readonly<{ type: "shoot_beside_player", degrees: number }>;
export type TSetShotSpeed =        Readonly<{ type: "setShotSpeed", pixelsPerFrame: number }>;
// Moves relative to current position.
export type TMove =                Readonly<{ type: "move", frames: number } & Partial<Vector>>;
// A very atomic action.
export type TMoveDelta =           Readonly<{ type: "moveDelta", x?: number, y?: number }>
// Move to an absolute postion on screen.
export type TMoveToAbsolute =      Readonly<{ type: "moveToAbsolute",
moveTo: Partial<Vector>, frames: number }>;
export type TSetPosition =         Readonly<{ type: "set_position", x: number, y: number }>;
export type TSetSpeed =            Readonly<{ type: "setSpeed", pixelsPerFrame: number }>;
export type TRotateAroundAbsolutePoint = Readonly<{
   type: "rotate_around_absolute_point", point:Partial<Vector>, degrees:number, frames:number
}>;
export type TRotateAroundRelativePoint = Readonly<{
   type: "rotate_around_relative_point", point:Partial<Vector>, degrees:number, frames:number
}>
/**
 * Like Promise.race.
 * Executes TAction lists in parallel, stops when any one of them has finished.
 */
export type TparallelRace       = Readonly<{ type: "parallelRace", actionsLists: TAction[][] }>;
export type TparallelAll        = Readonly<{ type: "parallelAll", actionsLists: TAction[][] }>;
export type TRotateTowardsPlayer = Readonly<{ type: "rotate_towards_player" }>;
export type TMoveAccordingToSpeedAndDirection = { type: "move_according_to_speed_and_direction" };
// Spawns an enemy. actions are prepended to the actions of the particular enemy.
export type TSpawn = {
   type: "spawn", enemy: string, x?: number, y?: number, actions?: TAction[]
};
// Simple if-equals case. Executes yes if true. Executs no when false.
export type TAttr =
   { type: "attr", attrName: string, is: TAttrValue, yes?: TAction[], no?: TAction[] };
// Increments an attribute. Obviously will blow up if trying to increment a non-number.
export type TIncrement =
{ type: "incr", attribute: string };
// Decrements an attribute. Obviously will blow up if trying to increment a non-number.
export type TDecrement =
{ type: "decr", attribute: string };

/**
 * Mirroring mirrors an axis.
 * If you have an enemy that moves like another enemy, except
 * that every x movement is inverted then try mirrorX.
 */
export type TMirrorX = { type: "mirrorX", value: boolean };
export type TMirrorY = { type: "mirrorY", value: boolean };
/**
 * The only purpose for this is to "flatten" arrays in YAML.
 * The action simple executes the actions sent to it. As simple as that.
 */
export type TDo = { type: "do", acns: TAction[] };
// Well, the enemy dies.
export type TDie = { type: "die" };
/**
 * Enemy despawns. Like "die" except onDeathAction is NOT triggered.
 * An example of when this should be used is when an enemy despawns outside of the screen,
 * you probably don't want to trigger an onDeath with explodes the enemy into bullets.
 */
export type TDespawn = { type: "despawn" };
/**
 * Attributes can be either some predefined thing by me such as hp, points,
 * or it could be  end-user specified variable with any type.
 */
export type TSetAttribute = { type: "setAttribute", attribute: string, value: TAttrValue };
// Waits until Enemy is outside the screen/game window
export type TWaitTilOutsideScreen = { type: "waitTilOutsideScreen" };
// Waits until Enemy is inside the screen/game window
export type TWaitTilInsideScreen = { type: "waitTilInsideScreen" };
/**
 * Fork is like fork in C essentially. The actions in fork executes separately
 * (in a separate generator) i.e. these actions won't delay other actions.
 * Usually you can get the same behaviour with `paralllelAll`/`parallelRace` but in some situations
 * the parallel actions aren't really an option (such as when you prepend actions when spawning
 * a new enemy and you want those actions to not delay the enemy's own actions, but rather
 * execute in parallel to them).
 */
export type TFork = { type: "fork", actions: TAction[] };
/**
 * Set only the move direction. Only specific some move actions care about the direction which 
 * gotta be called to move in the direction set with this action.
 */
export type TMoveDirection = Readonly<{ type: "setMoveDirection", degrees: number }>;
// Yields until the attribute has the value set in is.
export type TWaitUntilAttrIs = Readonly<{
   type: "waitUntilAttrIs", attr: string, is: TAttrValue
}>;

/**
 * This action is a way to react to input/gamepad/controls, mainly made in order
 * to allow the Player to be an Enemy (i.e. GameObject)
 */
export type TMoveAccordingToInput = Readonly<{ type: "moveAccordingToInput" }>;
export type TWaitInputShoot = Readonly<{ type: "waitInputShoot" }>;
export type TWaitInputLaser = Readonly<{ type: "waitInputLaser" }>;

// Signals that the level has been finished, so trigger this when end boss dies or something similar
export type TFinishLevel = Readonly<{ type: "finishLevel" }>;

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
   TDie |
   TDespawn |
   TWaitTilOutsideScreen |
   TWaitTilInsideScreen |
   /**
    * Control/Conditions/Attributes
    */
   TAttr |
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
   TGraphicsActionWithoutHandle
>;
