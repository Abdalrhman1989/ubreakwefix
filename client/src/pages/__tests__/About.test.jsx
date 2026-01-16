// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import About from '../About';

// Mock Dependencies
vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key, options) => {
            if (options?.returnObjects) {
                if (key === 'aboutContent.whyChoose') return [{ title: 'Why 1', desc: 'Desc 1' }];
                if (key === 'aboutContent.sections') return [{ title: 'Section 1', content: 'Content 1' }];
                if (key === 'aboutContent.repairList') return ['Repair 1'];
                return [];
            }
            return key;
        },
        language: 'da'
    })
}));

vi.mock('../../components/MapSection', () => ({ default: () => <div data-testid="map">MapSection</div> }));
vi.mock('../../components/home/TrustSection', () => ({ default: () => <div data-testid="trust">TrustSection</div> }));

describe('About Page', () => {
    it('renders about page content successfully', () => {
        render(
            <HelmetProvider>
                <About />
            </HelmetProvider>
        );

        expect(screen.getByText('aboutContent.bannerTitle')).toBeInTheDocument();
        expect(screen.getByTestId('map')).toBeInTheDocument();
        expect(screen.getByTestId('trust')).toBeInTheDocument();
    });
});
