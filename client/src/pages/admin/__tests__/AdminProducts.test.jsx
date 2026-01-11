import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminProducts from '../AdminProducts';
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

// Mock Child Components if any? 
// AdminProducts likely uses simple tables or lists.

describe('AdminProducts Operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: [] });
    });

    const renderAdminProducts = () => {
        return render(
            <BrowserRouter>
                <AdminProducts />
            </BrowserRouter>
        );
    };

    it('renders products list successfully', async () => {
        const mockProducts = [
            { id: 1, name: 'Screen Protector', price: 100, stock: 50 },
            { id: 2, name: 'Phone Case', price: 200, stock: 30 }
        ];
        axios.get.mockResolvedValue({ data: mockProducts });

        renderAdminProducts();

        await waitFor(() => {
            expect(screen.getByText('Screen Protector')).toBeInTheDocument();
            expect(screen.getByText('Phone Case')).toBeInTheDocument();
        });
    });
});
