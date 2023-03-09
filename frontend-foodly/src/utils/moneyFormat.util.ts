export const moneyFormat = (value: number | string): string => {
    return new Intl.NumberFormat('ru-Ru', {
        minimumFractionDigits: 0,
    }).format(Number(value));
};