import slugifyLib from 'slugify';

export const slugify = (str: string): string => {
    return slugifyLib(str, {
        lower: true,
        strict: true,
        trim: true,
        locale: 'en',
        replacement: '-',
    });
};