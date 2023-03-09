export const RoutesConfig = {
    Login: '/login',
    Home: '/',
    Category: (slug: string) => `/categories/${slug}`,
    Product: (slug: string | number) => `/products/${slug}`,
} as const;