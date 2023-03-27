export const DELIVERY_ERRORS = {
    NOT_FOUND: (context?: string) => {
        if (context) {
            return `Delivery with given ${context} not found`;
        }

        return 'Delivery not found';
    },
    FINISHED_DELIVERY: 'Delivery is already finished',
    NO_DELIVERY_CHARGE_ON_UPDATE: 'A update request cannot be processed without delivery charge',
    PAYMENT_MADE: 'Payment is already made',
};