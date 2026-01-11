import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Business from '../Business';

describe('Business Page', () => {
    it('renders business page content', () => {
        render(
            <BrowserRouter>
                <Business />
            </BrowserRouter>
        );

        expect(screen.getByText('ERHVERVSAFTALE')).toBeInTheDocument();
        expect(screen.getByText('Hold din virksomhed kørende')).toBeInTheDocument();
        expect(screen.getByText('Prioriteret Service')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Opret erhvervskonto' })).toBeInTheDocument();
    });
});
