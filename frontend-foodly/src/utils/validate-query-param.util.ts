export function validateQueryParam(param: ParamType, type: 'string'): string | null;
export function validateQueryParam(param: ParamType, type: 'number'): number | null;
export function validateQueryParam(param: ParamType, type: 'string' | 'number') {
    if (param === undefined) {
        return null;
    }

    if (type === 'number') {
        if (typeof param === 'string' && isNaN(+param) === false) {
            return +param;
        }
    }

    if (type === 'string') {
        if (typeof param === 'string' && param.trim().length > 0) {
            return param;
        }
    }

    return null;
}

type ParamType = string | string[] | undefined;