// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBox from '../SearchBox';
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

describe('SearchBox Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // vi.useFakeTimers(); // Switching to real timers for reliability
    });

    afterEach(() => {
        // vi.useRealTimers();
    });

    const renderSearchBox = () => {
        return render(
            <BrowserRouter>
                <SearchBox />
            </BrowserRouter>
        );
    };

    it('updates input value on change', () => {
        renderSearchBox();
        const input = screen.getByPlaceholderText(/Search model/i);
        fireEvent.change(input, { target: { value: 'iPhone' } });
        expect(input.value).toBe('iPhone');
    });

    it('triggers search API after debounce', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1, brand_name: 'Apple', name: 'iPhone 13' }] });
        renderSearchBox();
        const input = screen.getByPlaceholderText(/Search model/i);
        fireEvent.change(input, { target: { value: 'iPhone' } });

        // Wait for debounce (real time)
        await new Promise(resolve => setTimeout(resolve, 350));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/api/models?search=iPhone');
        });
    });

    it('displays search results', async () => {
        const mockResults = [
            { id: 1, brand_name: 'Apple', name: 'iPhone 13' },
            { id: 2, brand_name: 'Samsung', name: 'Galaxy S21' }
        ];
        axios.get.mockResolvedValue({ data: mockResults });

        renderSearchBox();
        const input = screen.getByPlaceholderText(/Search model/i);
        fireEvent.change(input, { target: { value: 'Phone' } });

        await new Promise(resolve => setTimeout(resolve, 350));

        await waitFor(() => {
            expect(screen.getByText('iPhone 13')).toBeInTheDocument();
            expect(screen.getByText('Galaxy S21')).toBeInTheDocument();
        });
    });

    it('navigates on result select', async () => {
        const mockResults = [{ id: 101, brand_name: 'Apple', name: 'iPhone 13' }];
        axios.get.mockResolvedValue({ data: mockResults });

        renderSearchBox();
        const input = screen.getByPlaceholderText(/Search model/i);
        fireEvent.change(input, { target: { value: 'iPhone' } });

        await new Promise(resolve => setTimeout(resolve, 350));

        await waitFor(() => expect(screen.getByText('iPhone 13')).toBeInTheDocument());

        fireEvent.click(screen.getByText('iPhone 13'));

        expect(mockNavigate).toHaveBeenCalledWith('/reparation/101');
    });
});
