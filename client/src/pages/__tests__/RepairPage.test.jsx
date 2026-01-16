import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import RepairPage from '../RepairPage';
import axios from 'axios';

// Mock Dependencies
vi.mock('axios');

vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key) => key
    })
}));

vi.mock('../../context/CartContext', () => ({
    useCart: () => ({
        addToCart: vi.fn(),
        cart: [],
        getCartTotal: () => 0
    })
}));

describe('RepairPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });



    const renderRepairPage = (modelId) => {
        return render(
            <HelmetProvider context={{}}>
                <MemoryRouter initialEntries={[`/reparation/${modelId}`]}>
                    <Routes>
                        <Route path="/reparation/:modelId" element={<RepairPage />} />
                    </Routes>
                </MemoryRouter>
            </HelmetProvider>
        );
    };

    it('renders model details and repairs successfully', async () => {
        const mockModel = {
            id: '101',
            brand_name: 'Apple',
            name: 'iPhone 13',
            image: '/iphone.png'
        };
        const mockRepairs = [
            { id: 1, name: 'Skærm', price: 1000, duration: '1 time' },
            { id: 2, name: 'Batteri', price: 500, duration: '30 min' }
        ];

        axios.get.mockImplementation((url) => {
            if (url.includes('/repairs')) return Promise.resolve({ data: mockRepairs });
            return Promise.resolve({ data: mockModel });
        });

        renderRepairPage('101');

        expect(await screen.findByRole('heading', { name: /Apple/i }, { timeout: 3000 })).toBeInTheDocument();
        expect(screen.getByText('Skærm')).toBeInTheDocument();
        expect(screen.getByText('Batteri')).toBeInTheDocument();
    });

    it('shows loading state initially', async () => {
        axios.get.mockImplementation(() => new Promise(() => { }));
        renderRepairPage('101');
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('/api/models/101');
    });
});
