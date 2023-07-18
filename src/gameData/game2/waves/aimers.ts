import {
   repeat, spawn, wait
} from "../../utils";
import { col, row } from "../common";

const aimerTop = spawn("nonShootingAimer", { x: col[11], y: row[3] });
const aimerBottom = spawn("nonShootingAimer", { x: col[11], y: row[7] });

export const aimersWave = repeat(8, [
   aimerTop,
   aimerBottom,
   wait(40)
]);
