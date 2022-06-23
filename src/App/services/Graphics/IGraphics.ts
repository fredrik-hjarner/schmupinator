import type { IService } from "../IService";

export type THandle = string;

export type TShape = "circle" | "square" | "triangle";

/***********
 * Actions *
 ***********/
// Asks the Graphics Engine for a graphics element if you want one.
export type TAction_AskForElement = { type: "actionAskForElement" };
export type TAction_SetPosition = {
   type: "actionSetPosition",
   handle: THandle, x?: number, y?: number
};
export type TAction_SetDiameter = {
   type: "actionSetDiameter",
   handle: THandle, diameter: number
};
export type TAction_SetHealth = {
   type: "actionSetHealth",
   handle: THandle,
   healthFactor: number // 0 = no health, 1 = full health
};
// Releases a GraphicsElement, so it's free for other to pick up/ask for/claim.
export type TAction_Release = { type: "actionRelease", handle: THandle };
export type TAction_SetColor = {
   type: "actionSetColor",
   handle: THandle, color: string
};
export type TAction_SetShape = {
   type: "actionSetShape",
   handle: THandle, shape: TShape
};

export type TGraphicsAction =
   TAction_AskForElement | TAction_SetPosition | TAction_SetDiameter | TAction_SetHealth |
   TAction_Release | TAction_SetColor | TAction_SetShape;

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
