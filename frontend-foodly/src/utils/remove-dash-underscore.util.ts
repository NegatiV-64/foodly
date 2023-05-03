export const removeDashUnderscore = (str: string) => {
    return str.replaceAll(/[-_]/g, ' ');
};