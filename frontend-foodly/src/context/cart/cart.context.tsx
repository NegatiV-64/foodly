import { createContext, useContext, useMemo, useState } from 'react';

const cartContext = createContext<CartContext>({} as CartContext);

interface CartContext {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (product_id: number) => void;
    clearCart: () => void;
    increaseQuantity: (product_id: number) => void;
    decreaseQuantity: (product_id: number) => void;
    totalPrice: number;
    totalQuantity: number;
}

export const useCart = () => useContext(cartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Computed properties
    const totalPrice = useMemo(() => items.reduce((acc, item) => acc + item.product_price * item.product_quantity, 0), [items]);
    const totalQuantity = useMemo(() => items.reduce((acc, item) => acc + item.product_quantity, 0), [items]);

    function addItem(item: CartItem) {
        const itemIndex = items.findIndex((item) => item.product_id === item.product_id);

        setItems((prevItems) => {
            // If item already exists in cart, update quantity
            if (itemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[itemIndex].product_quantity += item.product_quantity;
                return updatedItems;
            }

            // If item does not exist in cart, add it
            return [...prevItems, item];
        });
    }

    function removeItem(productId: number) {
        setItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
    }

    function clearCart() {
        setItems([]);
    }

    function increaseQuantity(productId: number) {
        const itemIndex = items.findIndex((item) => item.product_id === productId);

        setItems((prevItems) => {
            const updatedItems = [...prevItems];

            // If item does not exist in cart, return previous items
            if (itemIndex < 0) return updatedItems;

            updatedItems[itemIndex].product_quantity += 1;

            return updatedItems;
        });
    }

    function decreaseQuantity(productId: number) {
        const itemIndex = items.findIndex((item) => item.product_id === productId);

        setItems((prevItems) => {
            const updatedItems = [...prevItems];

            // If item does not exist in cart, return previous items
            if (itemIndex < 0) return updatedItems;

            // If item quantity is 1, remove item from cart
            if (updatedItems[itemIndex].product_quantity === 1) {
                return updatedItems.filter((item) => item.product_id !== productId);
            }

            updatedItems[itemIndex].product_quantity -= 1;

            return updatedItems;
        });
    }

    const contextValue: CartContext = {
        items,
        addItem,
        removeItem,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalPrice,
        totalQuantity,
    };

    return (
        <cartContext.Provider value={contextValue}>
            {children}
        </cartContext.Provider>
    );
};

export interface CartItem {
    product_id: number;
    product_name: string;
    product_price: number;
    product_image: string;
    product_quantity: number;
}