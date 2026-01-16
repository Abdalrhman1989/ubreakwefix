import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Booking from '../Booking';
import axios from 'axios';

// Mock Dependencies
vi.mock('axios'); // Use global mock or auto-mock
// Override specifically if needed, but simple mock should suffice
// axios.post.mockResolvedValue({});
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock Auth wrapper
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: null })
}));

describe('Booking Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axios.post.mockResolvedValue({});
    });

    const renderBooking = () => {
        return render(
            <BrowserRouter>
                <Booking />
            </BrowserRouter>
        );
    };

    it('renders the booking form successfully', () => {
        renderBooking();
        expect(screen.getByRole('heading', { name: /Book.*Reparation/i })).toBeInTheDocument();
        expect(screen.getByLabelText('Navn')).toBeInTheDocument();
        expect(screen.getAllByLabelText(/Email/i)[0]).toBeInTheDocument(); // Email might appear multiple times or be ambiguous
        expect(screen.getByText('Bekræft Booking')).toBeInTheDocument();
    });

    it('submits the form with valid data', async () => {
        renderBooking();

        // Fill form
        fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getAllByLabelText(/Email/i)[0], { target: { value: 'test@booking.com' } });
        fireEvent.change(screen.getByLabelText('Telefon'), { target: { value: '12345678' } });
        fireEvent.change(screen.getByLabelText('Enhed'), { target: { value: 'iPhone 15' } });
        fireEvent.change(screen.getByLabelText('Beskrivelse'), { target: { value: 'Broken screen' } });
        fireEvent.change(screen.getByLabelText('Ønsket Dato'), { target: { value: '2025-01-01' } });

        // Submit
        fireEvent.click(screen.getByText('Bekræft Booking'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('/api/bookings', expect.objectContaining({
                customerName: 'Test User',
                deviceModel: 'iPhone 15'
            }));
        });

        // Check success state
        expect(screen.getByText('Booking Bekræftet!')).toBeInTheDocument();
    });

    it('displays error execution on API failure', async () => {
        axios.post.mockRejectedValue(new Error('Network Error'));
        renderBooking();

        // Form requires all fields
        fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getAllByLabelText(/Email/i)[0], { target: { value: 'test@error.com' } });
        fireEvent.change(screen.getByLabelText('Telefon'), { target: { value: '12345678' } });
        fireEvent.change(screen.getByLabelText('Enhed'), { target: { value: 'Test Device' } });
        fireEvent.change(screen.getByLabelText('Beskrivelse'), { target: { value: 'Test Problem' } });
        fireEvent.change(screen.getByLabelText('Ønsket Dato'), { target: { value: '2025-01-01' } });

        fireEvent.click(screen.getByText('Bekræft Booking'));

        await waitFor(() => {
            expect(screen.getByText((content) => content.includes('Der opstod en fejl'))).toBeInTheDocument();
        });
    });
});
