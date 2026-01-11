import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../About';

// Mock Dependencies
vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key) => key
    })
}));

vi.mock('../../components/MapSection', () => ({ default: () => <div data-testid="map">MapSection</div> }));
vi.mock('../../components/home/TrustSection', () => ({ default: () => <div data-testid="trust">TrustSection</div> }));

describe('About Page', () => {
    it('renders about page content successfully', () => {
        render(<About />);

        expect(screen.getByText('about.title')).toBeInTheDocument();
        expect(screen.getByTestId('map')).toBeInTheDocument();
        expect(screen.getByTestId('trust')).toBeInTheDocument();
    });
});
