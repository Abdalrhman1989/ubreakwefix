import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import * as AuthContext from '../../../context/AuthContext';

// Mock AuthContext
vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('AdminLayout Protection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects unauthenticated users to login', () => {
        AuthContext.useAuth.mockReturnValue({ user: null });

        render(
            <MemoryRouter>
                <AdminLayout />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('redirects non-admin users to login', () => {
        AuthContext.useAuth.mockReturnValue({ user: { role: 'user', name: 'John' } });

        render(
            <MemoryRouter>
                <AdminLayout />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('allows access to admin users', () => {
        AuthContext.useAuth.mockReturnValue({ user: { role: 'admin', name: 'Admin' }, logout: vi.fn() });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<div>Admin Dashboard Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.getAllByText('Admin Panel').length).toBeGreaterThan(0);
        expect(screen.getByText('Admin Dashboard Content')).toBeInTheDocument();
    });
});
