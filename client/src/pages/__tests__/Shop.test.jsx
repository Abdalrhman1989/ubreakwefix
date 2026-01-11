import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Shop from '../Shop';
import axios from 'axios';

// Mock dependencies
vi.mock('axios');
vi.mock('../../context/CartContext', () => ({
    useCart: () => ({
        addToCart: vi.fn()
    })
}));

// Mock Data
const mockCategories = [
    { id: 1, name: 'Phones', parent_id: null },
    { id: 2, name: 'Accessories', parent_id: null },
    { id: 3, name: 'iPhones', parent_id: 1 }
];

const mockProducts = [
    {
        id: 1,
        name: 'iPhone 13',
        description: 'Latest Apple phone',
        price: 5000,
        category_id: 3,
        image_url: '/iphone.png',
        stock_quantity: 10,
        specs: { brand: 'Apple', features: ['5G'] }
    },
    {
        id: 2,
        name: 'Samsung S21',
        description: 'Samsung Galaxy',
        price: 4500,
        category_id: 1,
        image_url: '/samsung.png',
        stock_quantity: 5,
        specs: { brand: 'Samsung', features: ['5G', 'OLED'] }
    },
    {
        id: 3,
        name: 'Case',
        description: 'Phone case',
        price: 100,
        category_id: 2,
        image_url: '/case.png',
        stock_quantity: 0, // Sold out
        specs: { brand: 'Generic', features: [] }
    }
];

describe('Shop Component', () => {
    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url === '/api/categories') return Promise.resolve({ data: mockCategories });
            if (url === '/api/products') return Promise.resolve({ data: mockProducts });
            return Promise.resolve({ data: [] });
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const renderShop = () => {
        return render(
            <BrowserRouter>
                <Shop />
            </BrowserRouter>
        );
    };

    it('renders products after loading', async () => {
        renderShop();
        expect(screen.getByText('Loading products...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('iPhone 13')).toBeInTheDocument();
            expect(screen.getByText('Samsung S21')).toBeInTheDocument();
            expect(screen.getByText('Case')).toBeInTheDocument();
        });

        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    });

    it('filters products by search term', async () => {
        renderShop();
        await waitFor(() => expect(screen.getByText('iPhone 13')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText('Search products...');
        fireEvent.change(searchInput, { target: { value: 'Samsung' } });

        await waitFor(() => {
            expect(screen.queryByText('iPhone 13')).not.toBeInTheDocument();
            expect(screen.getByText('Samsung S21')).toBeInTheDocument();
        });
    });

    it('filters products by brand', async () => {
        renderShop();
        await waitFor(() => expect(screen.getByText('iPhone 13')).toBeInTheDocument());

        // Open mobile filter if needed or just find the input directly if visible
        // In this implementation, the sidebar inputs are rendered but might be visually hidden on mobile
        // JSDOM renders them.

        // Find Samsung checkbox
        const brandCheckbox = screen.getByLabelText('Samsung');
        fireEvent.click(brandCheckbox);

        await waitFor(() => {
            expect(screen.queryByText('iPhone 13')).not.toBeInTheDocument();
            expect(screen.getByText('Samsung S21')).toBeInTheDocument();
            expect(screen.queryByText('Case')).not.toBeInTheDocument();
        });
    });

    it('shows empty state when no matches found', async () => {
        renderShop();
        await waitFor(() => expect(screen.getByText('iPhone 13')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText('Search products...');
        fireEvent.change(searchInput, { target: { value: 'NonExistentProductXYZ' } });

        await waitFor(() => {
            expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument();
        });
    });

    it('displays sold out badge', async () => {
        renderShop();
        await waitFor(() => expect(screen.getByText('Case')).toBeInTheDocument());

        expect(screen.getByText('Sold Out')).toBeInTheDocument();
    });
});
