import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from '../Checkout';
import axios from 'axios';

// Mock Dependencies
vi.mock('axios');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock Contexts with mutable state for tests
const mockCart = [
    { uniqueId: 'u1', modelName: 'iPhone 13', repairName: 'Screen Replacement', price: 1000 }
];
const mockClearCart = vi.fn();
const mockRemoveFromCart = vi.fn();

vi.mock('../../context/CartContext', () => ({
    useCart: () => ({
        cart: mockCart,
        getCartTotal: () => 1000,
        clearCart: mockClearCart,
        removeFromCart: mockRemoveFromCart
    })
}));

const mockUser = null;
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser
    })
}));

describe('Checkout Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Return id for order creation and url for payment link
        axios.post.mockResolvedValue({ data: { success: true, id: 'order-123', url: 'https://payment.url' } });
        axios.get.mockResolvedValue({ data: [] });

        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true
        });
    });

    const renderCheckout = () => {
        return render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );
    };

    it('renders checkout form when cart has items', () => {
        renderCheckout();
        expect(screen.getByText('Checkout')).toBeInTheDocument();
        expect(screen.getByText('iPhone 13')).toBeInTheDocument();
        // Price can appear multiple times
        expect(screen.getAllByText('kr 1000').length).toBeGreaterThan(0);
    });

    it('validates required fields', async () => {
        renderCheckout();

        // In JSDOM, HTML5 validation attributes exist but don't prevent event handlers by default like browsers.
        // We verify the constraints are present.

        const nameInput = screen.getByPlaceholderText('John Doe');
        expect(nameInput).toBeRequired();

        const emailInput = screen.getByPlaceholderText('john@example.com');
        expect(emailInput).toBeRequired();

        const phoneInput = screen.getByPlaceholderText('+45 12 34 56 78');
        expect(phoneInput).toBeRequired();
    });

    it('submits order successfully with valid data', async () => {
        renderCheckout();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('+45 12 34 56 78'), { target: { value: '12345678' } });

        // Submit
        const submitBtn = screen.getByText('Confirm Order');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // Should be called twice: 1. Create Order, 2. Get Payment Link
            expect(axios.post).toHaveBeenCalledTimes(2);
        });

        // Verify redirection to payment
        expect(window.location.href).toBe('https://payment.url');
    });

    it('displays error message on API failure', async () => {
        axios.post.mockRejectedValue(new Error('API Error'));
        renderCheckout();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('+45 12 34 56 78'), { target: { value: '12345678' } });

        const submitBtn = screen.getByText('Confirm Order');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Payment Failed: API Error. Please try again.')).toBeInTheDocument();
        });

        expect(mockClearCart).not.toHaveBeenCalled();
    });
});
