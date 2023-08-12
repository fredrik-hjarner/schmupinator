import { describe, it, expect } from "vitest";

import { Highscore } from "../Highscore.ts";

const createHighscoreFixture = async (): Promise<Highscore> => {
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

   return hs;
};

describe("registerNewEntry", () => {
   it("dont qualify for top10", async () => {
      const hs = await createHighscoreFixture();

      const expected = hs.getTop10();
      hs.registerNewEntry({ name: "Nils", score: 0 });
      const actual = hs.getTop10();
      expect(actual).toEqual(expected);
   });

   it("rank 0 (top1)", async () => {
      const hs = await createHighscoreFixture();

      const expected = [
         { name: "Nils", score: 11 },
         { name: "A", score: 10 },
         { name: "B", score: 9 },
         { name: "C", score: 8 },
         { name: "D", score: 7 },
         { name: "E", score: 6 },
         { name: "F", score: 5 },
         { name: "G", score: 4 },
         { name: "H", score: 3 },
         { name: "I", score: 2 },
      ];
      hs.registerNewEntry({ name: "Nils", score: 11 });
      expect(hs.getTop10().length).toBe(10);
      const actual = hs.getTop10();
      expect(actual).toEqual(expected);
   });

   it("rank 1 (top2)", async () => {
      const hs = await createHighscoreFixture();

      const expected = [
         { name: "A", score: 10 },
         { name: "Nils", score: 10 },
         { name: "B", score: 9 },
         { name: "C", score: 8 },
         { name: "D", score: 7 },
         { name: "E", score: 6 },
         { name: "F", score: 5 },
         { name: "G", score: 4 },
         { name: "H", score: 3 },
         { name: "I", score: 2 },
      ];
      hs.registerNewEntry({ name: "Nils", score: 10 });
      expect(hs.getTop10().length).toBe(10);
      const actual = hs.getTop10();
      expect(actual).toEqual(expected);
   });
});