import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth(); // Access user to check for business role
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
            const uniqueId = item.uniqueId || (Date.now() + Math.random().toString(36).substr(2, 9));
            const newItem = { ...item, uniqueId };

            // For Repairs: Prevent duplicate logic (id + modelId)
            if (item.isRepair || item.repairName) {
                const exists = current.find(i => i.id === item.id && i.modelId === item.modelId);
                if (exists) return current;
            }

            return [...current, newItem];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(current => current.filter(i => i.uniqueId !== itemId));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        // BUSINESS RULE: 20% Discount for Approved Business Users
        if (user && user.role === 'business') {
            // Apply discount per item and rounded, to match the display in Checkout/Shop
            return cart.reduce((total, item) => total + Math.round((item.price || 0) * 0.8), 0);
        }

        return cart.reduce((total, item) => total + (item.price || 0), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
