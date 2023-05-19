import type { IService } from "../IService";
import type { IDestroyable } from "../../../utils/types/IDestroyable";

// TODO: replace with NoopServive!!
export interface IGameSpeed extends IService, IDestroyable {
   name: string; // TODO: name seems to be redundant since it is already in IService.
}
