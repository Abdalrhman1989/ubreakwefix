import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RepairsIndex from '../RepairsIndex';
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

vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key) => key
    })
}));

vi.mock('../components/SearchBox', () => ({ default: () => <div data-testid="search-box">SearchBox</div> }));

describe('RepairsIndex Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: [] });
    });

    const renderRepairsIndex = () => {
        return render(
            <BrowserRouter>
                <RepairsIndex />
            </BrowserRouter>
        );
    };

    it('renders list of brands', async () => {
        const mockBrands = [
            { id: 1, name: 'Apple', image: '/apple.png' },
            { id: 2, name: 'Samsung', image: '/samsung.png' }
        ];
        axios.get.mockImplementation((url) => {
            if (url === '/api/brands') return Promise.resolve({ data: mockBrands });
            return Promise.resolve({ data: [] });
        });

        renderRepairsIndex();

        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
            expect(screen.getByText('Samsung')).toBeInTheDocument();
        });
    });

    it('fetches and displays models when a brand is clicked', async () => {
        const mockBrands = [{ id: 1, name: 'Apple' }];
        const mockModels = [{ id: 101, name: 'iPhone 13', family: 'iPhone' }];

        axios.get.mockImplementation((url) => {
            if (url === '/api/brands') return Promise.resolve({ data: mockBrands });
            if (url === '/api/brands/1/models') return Promise.resolve({ data: mockModels });
            return Promise.resolve({ data: [] });
        });

        renderRepairsIndex();

        await waitFor(() => expect(screen.getByText('Apple')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Apple'));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/api/brands/1/models');
            // Logic in RepairsIndex renders families if available. 
            // iPhone 13 family is 'iPhone'.
            // So we expect to see 'iPhone' text.
            expect(screen.getByText('iPhone')).toBeInTheDocument();
        });
    });
});
