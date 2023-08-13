import type { TEnvironment } from "./GetEnvironment.ts";

import { GetEnvironment } from "./GetEnvironment.ts";

const browserEnvs: TEnvironment[] = ["browser", "webworker_browser"];

export const IsBrowser = (): boolean => {
   return browserEnvs.includes(GetEnvironment());
};