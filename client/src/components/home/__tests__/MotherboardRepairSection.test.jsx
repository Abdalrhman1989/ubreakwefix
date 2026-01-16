import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MotherboardRepairSection from '../MotherboardRepairSection';

// Mock LanguageContext
vi.mock('../../../context/LanguageContext', () => {
    return {
        useLanguage: () => ({
            t: (key) => key
        }),
        __esModule: true,
    };
});

describe('MotherboardRepairSection', () => {
    beforeEach(() => {
        // Mock IntersectionObserver
        const observe = vi.fn();
        const disconnect = vi.fn();
        window.IntersectionObserver = vi.fn(function () {
            this.observe = observe;
            this.disconnect = disconnect;
        });
    });

    it('renders correctly with translation keys', () => {
        render(
            <MemoryRouter>
                <MotherboardRepairSection />
            </MemoryRouter>
        );

        expect(screen.getByText('motherboard.title')).toBeInTheDocument();
        expect(screen.getByText('motherboard.subtitle')).toBeInTheDocument();
        expect(screen.getByText('motherboard.chipLevel')).toBeInTheDocument();

        const cta = screen.getByText('motherboard.cta');
        expect(cta).toBeInTheDocument();
        expect(cta.closest('a')).toHaveAttribute('href', '/microsoldering');
    });
});
