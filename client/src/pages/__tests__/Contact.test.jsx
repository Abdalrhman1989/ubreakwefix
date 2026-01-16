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

        expect(screen.getByText('contactPage.title')).toBeInTheDocument();
        expect(screen.getByText('contactPage.subtitle')).toBeInTheDocument();
        expect(screen.getByText(/Skibhusvej 109/)).toBeInTheDocument();
        expect(screen.getByText('kontakt@ubreakwefix.dk')).toBeInTheDocument();
        expect(screen.getByTestId('map-section')).toBeInTheDocument();
    });
});
