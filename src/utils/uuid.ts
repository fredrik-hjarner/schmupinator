let id = 0;
export const uuid = () => {
   return id++;
};

/**
 * Only reason for guid to exist besides uuid is that guid is supposed to be used for 
 * things that ONLY run in the browser and not in node/deno,
 * this so that the uuid number will be exactly the same between browser, node, deno.
 */
let gid = 0;
export const guid = () => {
   return gid++;
};