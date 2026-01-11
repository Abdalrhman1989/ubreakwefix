import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminShopOrders from '../AdminShopOrders';
import axios from 'axios';

// Mock Dependencies
vi.mock('axios');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('AdminShopOrders', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderAdminShopOrders = () => {
        return render(
            <BrowserRouter>
                <AdminShopOrders />
            </BrowserRouter>
        );
    };

    it('renders orders list successfully', async () => {
        const mockOrders = [
            { id: 1001, customer_name: 'John Doe', customer_email: 'john@example.com', total_amount: 500, status: 'Pending', items_json: '[{"name":"Item 1", "quantity":1, "price":500}]', created_at: new Date().toISOString() },
            { id: 1002, customer_name: 'Jane Smith', customer_email: 'jane@example.com', total_amount: 1500, status: 'Completed', items_json: '[]', created_at: new Date().toISOString() }
        ];
        axios.get.mockResolvedValue({ data: mockOrders });

        renderAdminShopOrders();

        // Check for loading state first? Maybe too fast.

        expect(await screen.findByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('500 DKK')).toBeInTheDocument();
        expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    });

    it('displays no orders message when empty', async () => {
        axios.get.mockResolvedValue({ data: [] });
        renderAdminShopOrders();
        expect(await screen.findByText('No orders found')).toBeInTheDocument();
    });
});
