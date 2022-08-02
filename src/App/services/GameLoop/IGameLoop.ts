import type { App } from "../../App";
import type { IService } from "../IService";

export interface IGameLoop extends IService {
   app: App;
   name: string;
   FrameCount: number;

   Start: () => void;
   // Public because GameSpeed might want control over frames.
   nextFrame: () => void;
}