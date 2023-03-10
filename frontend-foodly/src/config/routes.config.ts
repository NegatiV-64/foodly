export const RoutesConfig = {
    Login: '/login',
    Home: '/',
    Categories: '/categories',
    Category: (slug: string) => `/categories/${slug}`,
    Product: (slug: string | number) => `/products/${slug}`,
} as const;