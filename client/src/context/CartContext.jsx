import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(current => {
            // Avoid duplicates of exact same repair for same device
            // Note: For shop products we might want quantity instead of strict duplicate prevention?
            // For now, keeping logic but adding uniqueId.
            const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9);
            const newItem = { ...item, uniqueId };

            // For Repairs: Prevent duplicate logic (id + modelId)
            if (item.isRepair || item.repairName) {
                const exists = current.find(i => i.id === item.id && i.modelId === item.modelId);
                // If exists, maybe we should update it? Or just ignore? The original code ignored.
                if (exists) return current;
            }

            // For Shop Products: Ideally handle quantity, but for now just add as new line item or implement quantity later.
            // The prompt "remove from cart" implies line items.
            return [...current, newItem];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(current => current.filter(i => i.uniqueId !== itemId));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price || 0), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
