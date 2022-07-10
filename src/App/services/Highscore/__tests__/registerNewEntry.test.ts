import { Highscore } from '../Highscore';

const createHighscoreFixture = (): Highscore => {
   const top10 = [
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
   ];

   return new Highscore({ name: "hs", top10 });
}

describe("registerNewEntry", () => {
   it("dont qualify for top10", () => {
      const hs = createHighscoreFixture();

      const expected = hs.getTop10();
      hs.registerNewEntry({ name: "Nils", score: 0 });
      const actual = hs.getTop10();
      expect(actual).toEqual(expected);
   });

   it("rank 0 (top1)", () => {
      const hs = createHighscoreFixture();

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
      ]
      hs.registerNewEntry({ name: "Nils", score: 11 });
      expect(hs.getTop10().length).toBe(10);
      const actual = hs.getTop10();
      expect(actual).toEqual(expected);
   });

   it("rank 1 (top2)", () => {
      const hs = createHighscoreFixture();

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
      ]
      hs.registerNewEntry({ name: "Nils", score: 10 });
      expect(hs.getTop10().length).toBe(10);
      const actual = hs.getTop10();
      expect(actual).toEqual(expected);
   });
});