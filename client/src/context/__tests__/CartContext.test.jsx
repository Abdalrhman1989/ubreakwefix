// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';

// Helper component to test Context
const TestComponent = () => {
    const { cart, addToCart, removeFromCart, clearCart, getCartTotal } = useCart();

    return (
        <div>
            <div data-testid="cart-length">{cart.length}</div>
            <div data-testid="cart-total">{getCartTotal()}</div>
            <button onClick={() => addToCart({ id: 1, modelId: 'm1', price: 100, uniqueId: 'u1', isRepair: true })}>Add Item 1</button>
            <button onClick={() => addToCart({ id: 1, modelId: 'm1', price: 100, uniqueId: 'u2', isRepair: true })}>Add Duplicate Item 1</button>
            <button onClick={() => addToCart({ id: 2, modelId: 'm2', price: 200, uniqueId: 'u3' })}>Add Item 2</button>
            <button onClick={() => removeFromCart('u1')}>Remove Item 1</button>
            <button onClick={clearCart}>Clear Cart</button>
        </div>
    );
};

describe('CartContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('provides empty cart initially', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );
        expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
        expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });

    it('adds items to cart', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Item 1'));
        expect(screen.getByTestId('cart-length')).toHaveTextContent('1');
        expect(screen.getByTestId('cart-total')).toHaveTextContent('100');
    });

    it('prevents exact duplicates (same id and modelId)', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Item 1'));
        expect(screen.getByTestId('cart-length')).toHaveTextContent('1');

        // Try adding duplicate
        fireEvent.click(screen.getByText('Add Duplicate Item 1'));
        expect(screen.getByTestId('cart-length')).toHaveTextContent('1');
    });

    it('removes items from cart', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Item 1'));
        expect(screen.getByTestId('cart-length')).toHaveTextContent('1');

        fireEvent.click(screen.getByText('Remove Item 1'));
        expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
    });

    it('calculates total price correctly', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Item 1')); // 100
        fireEvent.click(screen.getByText('Add Item 2')); // 200

        expect(screen.getByTestId('cart-length')).toHaveTextContent('2');
        expect(screen.getByTestId('cart-total')).toHaveTextContent('300');
    });

    it('persists cart to localStorage', () => {
        const { unmount } = render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByText('Add Item 1'));
        expect(localStorage.getItem('cart')).toContain('"id":1');

        unmount();

        // Re-render to check initialization from localStorage
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );
        expect(screen.getByTestId('cart-length')).toHaveTextContent('1');
    });
});
