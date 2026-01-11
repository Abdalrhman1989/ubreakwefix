import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from '../Contact';

// Mock Language Context
vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key) => key // Return key as translation
    })
}));

// Mock MapSection
vi.mock('../../components/MapSection', () => ({
    default: () => <div data-testid="map-section">Map</div>
}));

describe('Contact Page', () => {
    it('renders contact information correctly', () => {
        render(<Contact />);

        expect(screen.getByText('nav.contact')).toBeInTheDocument();
        expect(screen.getByText('Butiksinformation')).toBeInTheDocument();
        expect(screen.getByText('Fonefix Odense')).toBeInTheDocument();
        expect(screen.getByText('kontakt@ubreakwefix.dk')).toBeInTheDocument();
        expect(screen.getByTestId('map-section')).toBeInTheDocument();
    });
});
