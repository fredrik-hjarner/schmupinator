import type { App } from "../../App";
import type { IService } from "../IService";

export interface IGameLoop extends IService {
   app: App;
   name: string;
   FrameCount: number;

   Start(): void;
}