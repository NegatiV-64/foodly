export const ORDER_ERRORS = {
    NOT_FOUND: (context?: string) => {
        let errorMessage = 'Given order was not found';

        if (context) {
            errorMessage = `${errorMessage}. Reason: Order with matching ${context} was not found`;
        }

        return errorMessage;
    },
    NOT_EMPLOYEE: 'Given user is not an employee',
    
};