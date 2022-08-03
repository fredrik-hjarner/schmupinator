import type { IService } from "../IService";

export type THandle = string;

export type TShape =
   "none" |
   "circle" |
   "square" |
   "triangle" |
   "diamondShield" |
   "octagon" |
   "explosion" |
   "roundExplosion";

/***********
 * Actions *
 ***********/
// Asks the Graphics Engine for a graphics element if you want one.
export type TGfx_AskForElement = { type: "gfxAskForElement" };
export type TGfx_SetPosition = {
   type: "gfxSetPosition",
   handle: THandle, x?: number, y?: number
};
export type TGfx_SetDiameter = {
   type: "gfxSetDiameter",
   handle: THandle, diameter: number
};
// Releases a GraphicsElement, so it's free for other to pick up/ask for/claim.
export type TGfx_Release = { type: "gfxRelease", handle: THandle };
export type TGfx_SetColor = {
   type: "gfxSetColor",
   handle: THandle, color: string
};
export type TGfx_SetShape = {
   type: "gfxSetShape",
   handle: THandle, shape: TShape
};
export type TGfx_SetRotation = {
   type: "gfxSetRotation",
   handle: THandle, degrees: number
};
export type TGfx_SetScale = {
   type: "gfxSetScale",
   handle: THandle, scale: number
};

export type TGraphicsAction =
   TGfx_AskForElement | TGfx_SetPosition | TGfx_SetDiameter | TGfx_Release |
   TGfx_SetColor | TGfx_SetShape | TGfx_SetRotation | TGfx_SetScale;

/**
 * When you run commands via a yaml file,the handle does not need to be sent in
 * because the enemy itself knows/has it's own graphics handle, so it is
 * unnecesary to add.
 */
export type TGraphicsActionWithoutHandle =
   // TGfx_AskForElement | // not allowed to run as command from yaml
   Omit<TGfx_SetPosition, "handle"> |
   Omit<TGfx_SetDiameter, "handle"> |
   // Omit<TGfx_Release, "handle"> | // not allowed to run as command from yaml
   Omit<TGfx_SetColor, "handle"> |
   Omit<TGfx_SetShape, "handle"> |
   Omit<TGfx_SetRotation, "handle"> |
   Omit<TGfx_SetScale, "handle">;

/*************
 * Responses *
 *************/
// Returns a handle to the element.
export type TResponse_AskForElement = {
   type: "responseAskForElement", handle: THandle,
}
export type TResponse_Void = { type: "responseVoid" };

export type TGraphicsResponse = TResponse_AskForElement | TResponse_Void;

export interface IGraphics extends IService {
   Dispatch(action: TGraphicsAction): TGraphicsResponse;
}
