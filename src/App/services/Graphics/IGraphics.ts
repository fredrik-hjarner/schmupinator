import type { IService } from "../IService";

export type THandle = string;

export type TShape = "circle" | "square" | "triangle" | "diamondShield";

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
export type TGfx_SetHealth = {
   type: "gfxSetHealth",
   handle: THandle,
   healthFactor: number // 0 = no health, 1 = full health
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

export type TGraphicsAction =
   TGfx_AskForElement | TGfx_SetPosition | TGfx_SetDiameter | TGfx_SetHealth |
   TGfx_Release | TGfx_SetColor | TGfx_SetShape;

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
