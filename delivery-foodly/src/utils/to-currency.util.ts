export const toCurrency = (amount: number) => {
    // Use Intl.NumberFormat to format the amount to currency
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

    // Return the formatted amount
    return `${new Intl.NumberFormat('uz-Uz').format(amount)} soms`;
};