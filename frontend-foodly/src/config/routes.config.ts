export const RoutesConfig = {
    Login: '/sign-in',
    Register: '/sign-up',
    Home: '/',
    Categories: '/categories',
    Category: (slug: string) => `/categories/${slug}`,
    Product: (slug: string | number) => `/products/${slug}`,
    Checkout: '/checkout',
    Account: '/account',
} as const;