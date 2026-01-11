import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
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

describe('Login Page', () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        AuthContext.useAuth.mockReturnValue({
            login: mockLogin
        });
    });

    const renderLogin = () => {
        return render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
    };

    it('renders login form', () => {
        renderLogin();
        expect(screen.getByText('auth.loginTitle')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'auth.loginBtn' })).toBeInTheDocument();
    });

    it('handles successful login and redirects normal user', async () => {
        mockLogin.mockResolvedValue({ success: true, user: { role: 'user', name: 'Bob' } });
        renderLogin();

        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'bob@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.loginBtn' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('bob@test.com', 'password123');
            expect(mockNavigate).toHaveBeenCalledWith('/profile');
        });
    });

    it('redirects admin to admin dashboard', async () => {
        mockLogin.mockResolvedValue({ success: true, user: { role: 'admin', name: 'Admin' } });
        renderLogin();

        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'admin@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'admin123' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.loginBtn' }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin');
        });
    });

    it('displays error message on failed login', async () => {
        mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
        renderLogin();

        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'wrong@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.loginBtn' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
