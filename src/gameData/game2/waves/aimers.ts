import {
   repeat, spawn, wait
} from "../../utils/utils.ts";
import { col, row } from "../common.ts";

const aimerTop = spawn("nonShootingAimer", { x: col[11], y: row[3] });
const aimerBottom = spawn("nonShootingAimer", { x: col[11], y: row[7] });

export const aimersWave = repeat(8, [
   aimerTop,
   aimerBottom,
   wait(40)
]);
