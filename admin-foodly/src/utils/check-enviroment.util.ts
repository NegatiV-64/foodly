export function checkEnvironment() {
    const isDOM = typeof window !== 'undefined' && window.document && window.document.documentElement;

    if (isDOM === false) {
        return 'server';
    }

    return 'client';
}