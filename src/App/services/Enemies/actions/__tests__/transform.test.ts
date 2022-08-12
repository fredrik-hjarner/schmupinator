import { transform } from '../transform'

function isShortForm(action: object): boolean {
   //@ts-ignore
   return action.type === "shortForm";
}

function transformOneAction(action: object): object {
   return { ...action, type: "longForm" };
}

it("simple", () => {
   const data = [
      { type: "shortForm" }
   ]
   const expected = [
      { type: "longForm" }
   ]
   const actual = structuredClone(data);
   transform(isShortForm, transformOneAction, actual);
   expect(actual).toEqual(expected);
});

it("nested 1 level", () => {
   const data = [
      {
         type: "shortForm",
         actions: [
            { type: "shortForm" }
         ]
      }
   ]
   const expected = [
      {
         type: "longForm",
         actions: [
            { type: "longForm" }
         ]
      }
   ]
   const actual = structuredClone(data);
   transform(isShortForm, transformOneAction, actual);
   expect(actual).toEqual(expected);
});

it("deep nesting and extra fields", () => {
   const data = [
      {
         type: "shortForm",
         hi: "hi",
         actions: [
            {
               type: "shortForm",
               something: "yes",
               actions: [
                  {
                     type: "shortForm",
                     something: "yes",
                     actions: []
                  }
               ]
            }
         ]
      }
   ]
   const expected = [
      {
         type: "longForm",
         hi: "hi",
         actions: [
            {
               type: "longForm",
               something: "yes",
               actions: [
                  {
                     type: "longForm",
                     something: "yes",
                     actions: []
                  }
               ]
            }
         ]
      }
   ]
   const actual = structuredClone(data);
   transform(isShortForm, transformOneAction, actual);
   expect(actual).toEqual(expected);
});

export { }