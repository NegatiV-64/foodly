export const excludeProperties = <ObjType, Key extends Extract<keyof ObjType, string>>(obj: ObjType, ...keys: Key[]): Omit<ObjType, Key> => {
    const copiedObj = { ...obj };

    for (const keyForDelete of keys) {
        for (const objKey in obj) {
            if (objKey === keyForDelete) {
                delete copiedObj[objKey];
            }
        }
    }

    return copiedObj;
};