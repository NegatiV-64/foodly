export function validateQueryParam(queryParam: string | string[] | undefined, type: 'string', options?: ValidateQueryParamOptions): string | null;
export function validateQueryParam(queryParam: string | string[] | undefined, type: 'number', options?: ValidateQueryParamOptions): number | null;
export function validateQueryParam(queryParam: string | string[] | undefined | number, type: 'string' | 'number', options?: ValidateQueryParamOptions): string | number | null {
    const { defaultValue, possibleValues } = options ?? {};

    if (type === 'string' && typeof queryParam === 'string') {
        if (queryParam.trim().length > 0) {
            if (defaultValue !== undefined && queryParam.trim() !== defaultValue) {
                return queryParam;
            }

            if (defaultValue === undefined) {
                return queryParam;
            }
        }
    }

    if (type === 'number' && typeof queryParam === 'string') {
        if (!isNaN(+queryParam) && +queryParam > 0 && Number.isInteger(+queryParam)) {
            if (defaultValue !== undefined && +queryParam !== defaultValue) {
                // Check if the query param is in the possible values
                if (possibleValues !== undefined && possibleValues.includes(+queryParam as never)) {
                    return +queryParam;
                }

                if (possibleValues === undefined) {
                    return +queryParam;
                }
            }

            if (defaultValue === undefined) {
                if (possibleValues !== undefined && possibleValues.includes(+queryParam as never)) {
                    return +queryParam;
                }

                if (possibleValues === undefined) {
                    return +queryParam;
                }
            }
        }
    }

    return null;
}

// Interface for the function options
interface ValidateQueryParamOptions {
    defaultValue?: string | number;
    possibleValues?: string[] | number[];
}