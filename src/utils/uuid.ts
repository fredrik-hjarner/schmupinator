const uuids: Record<string, number> = {};

export const uuid = (type: string) => {
   const currentUuid = uuids[type] || 0;
   const nextUuid = currentUuid + 1;
   uuids[type] = nextUuid;
   return currentUuid;
};
