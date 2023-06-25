import type { TQualifiedForTop10 } from "../Highscore";

import { describe, it, expect } from "vitest";

import { Highscore } from "../Highscore";

describe("qualifiedForTop10", async () => {
   const highscores = {
      version: 1,
      games: {
         game1: [
            { name: "A", score: 10 },
            { name: "B", score: 9 },
            { name: "C", score: 8 },
            { name: "D", score: 7 },
            { name: "E", score: 6 },
            { name: "F", score: 5 },
            { name: "G", score: 4 },
            { name: "H", score: 3 },
            { name: "I", score: 2 },
            { name: "J", score: 1 },
         ]
      },
   };
   const hs = new Highscore({ name: "hs", highscores });

   // @ts-ignorec
   // eslint-disable-next-line
   await hs.Init({ gameData: { getAndAssertActiveGame: () => "game1" } as any });

   it("dont qualify for top10", () => {
      const expected: TQualifiedForTop10 = {
         qualifiedForTop10: false,
         rank: undefined
      };
      const actual = hs.qualifiedForTop10(0);
      expect(actual).toEqual(expected);
   });
   it("rank 0 (top1)", () => {
      const expected: TQualifiedForTop10 = {
         qualifiedForTop10: true,
         rank: 0
      };
      const actual = hs.qualifiedForTop10(11);
      expect(actual).toEqual(expected);
   });
   it("rank 9 (top10)", () => {
      const expected: TQualifiedForTop10 = {
         qualifiedForTop10: true,
         rank: 9
      };
      const actual = hs.qualifiedForTop10(2);
      expect(actual).toEqual(expected);
   });
   it("same score as rank 0, but get rank 1 because later", () => {
      const expected: TQualifiedForTop10 = {
         qualifiedForTop10: true,
         rank: 1
      };
      const actual = hs.qualifiedForTop10(10);
      expect(actual).toEqual(expected);
   });
});