const uuids: Record<string, number> = {};

export const uuid = (type = "default") => {
   const currentUuid = uuids[type] || 0;
   const nextUuid = currentUuid + 1;
   uuids[type] = nextUuid;
   return currentUuid;
};

// TODO: Remove this, no longer needed.
/**
 * Only reason for guid to exist besides uuid is that guid is supposed to be used for 
 * things that ONLY run in the browser and not in node/deno,
 * this so that the uuid number will be exactly the same between browser, node, deno.
 */
export const guid = () => {
   return uuid("guid");
};