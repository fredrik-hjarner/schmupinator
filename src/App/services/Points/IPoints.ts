import type { IService } from "../IService";

export type THistoryEntry = { points: number, reason: string };

export interface IPoints extends IService {
   points: number;
   history: Partial<{ [frame: number]: THistoryEntry }>;
}
