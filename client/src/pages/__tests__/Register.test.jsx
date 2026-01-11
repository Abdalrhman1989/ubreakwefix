import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';
import * as AuthContext from '../../context/AuthContext';

// Mock Dependencies
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

vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

describe('Register Page', () => {
    const mockRegister = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        AuthContext.useAuth.mockReturnValue({
            register: mockRegister
        });
    });

    const renderRegister = () => {
        return render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
    };

    it('renders register form', () => {
        renderRegister();
        expect(screen.getByText('auth.registerTitle')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.name')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.confirmPassword')).toBeInTheDocument();
    });

    it('handles successful registration', async () => {
        mockRegister.mockResolvedValue({ success: true });
        renderRegister();

        fireEvent.change(screen.getByLabelText('auth.name'), { target: { value: 'New User' } });
        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'new@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.phone'), { target: { value: '12345678' } });
        fireEvent.change(screen.getByLabelText('auth.address'), { target: { value: 'Test St 1' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('auth.confirmPassword'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.registerBtn' }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New User',
                email: 'new@test.com'
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('validates password mismatch', async () => {
        renderRegister();

        // Fill all required fields first
        fireEvent.change(screen.getByLabelText('auth.name'), { target: { value: 'User' } });
        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.phone'), { target: { value: '12345678' } });
        fireEvent.change(screen.getByLabelText('auth.address'), { target: { value: 'Test St' } });

        // Then mismatch passwords
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('auth.confirmPassword'), { target: { value: 'mismatch' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.registerBtn' }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
            expect(mockRegister).not.toHaveBeenCalled();
        });
    });

    it('displays error on registration failure', async () => {
        mockRegister.mockResolvedValue({ success: false, error: 'Email already exists' });
        renderRegister();

        fireEvent.change(screen.getByLabelText('auth.name'), { target: { value: 'New User' } });
        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'existing@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.phone'), { target: { value: '12345678' } });
        fireEvent.change(screen.getByLabelText('auth.address'), { target: { value: 'Test St 1' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('auth.confirmPassword'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.registerBtn' }));

        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
