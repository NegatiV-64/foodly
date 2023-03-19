export const PRODUCT_ERRORS = {
    NOT_FOUND(context?: string) {
        let errorMessage = 'Given product was not found';

        if (context) {
            errorMessage = `${errorMessage}. Reason: Product with matching ${context} was not found`;
        }

        return errorMessage;
    },
    DELETE_IMAGE_ERROR: 'Error while deleting image',
    DELETE_HOLD_ORDER_ERROR: 'Current product is in some orders, that are not completed. Please, complete them first',
} as const;