export const queryBuilder = (baseUrl: string, ...queries: UrlQuery[]) => {
    let url = `/${baseUrl}/`;

    for (const link of queries) {
        if (link.value !== null && link.value !== undefined && link.default !== link.value) {
            if (typeof link.value === 'string' && link.value.length === 0) {
                continue;
            }

            if (url.includes('?')) {
                url = `${url}&${link.query}=${link.value}`;
            } else {
                url = `${url}?${link.query}=${link.value}`;
            }
        }
    }

    return url;
};


export interface UrlQuery {
    query: string;
    value: string | number;
    default?: string | number;
}