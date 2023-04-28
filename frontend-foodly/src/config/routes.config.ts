export const RoutesConfig = {
    Login: '/sign-in',
    Register: '/sign-up',
    Home: '/',
    Categories: '/categories',
    Category: (slug: string) => `/categories/${slug}`,
    Product: (slug: number) => `/products/${slug}`,
    Checkout: '/checkout',
    Account: '/account',
    Orders: '/account/orders',
    View_Order: (id: string) => `/account/orders/${id}`,
} as const;