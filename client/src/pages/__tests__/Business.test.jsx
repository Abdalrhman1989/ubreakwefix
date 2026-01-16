// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Business from '../Business';

vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key) => {
            const translations = {
                'business.hero.badge': 'ERHVERVSAFTALE',
                'business.hero.title': 'Hold din virksomhed kørende',
                'business.features.0.title': 'Prioriteret Service',
                'business.hero.cta': 'Opret erhvervskonto',
                'business.seo.title': 'Erhverv',
                'business.seo.desc': 'Erhverv desc'
            };
            return translations[key] || key;
        }
    })
}));

describe('Business Page', () => {
    it('renders business page content', () => {
        render(
            <HelmetProvider>
                <BrowserRouter>
                    <Business />
                </BrowserRouter>
            </HelmetProvider>
        );

        expect(screen.getByText('ERHVERVSAFTALE')).toBeInTheDocument();
        expect(screen.getByText('Hold din virksomhed kørende')).toBeInTheDocument();
        expect(screen.getByText('Prioriteret Service')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Opret erhvervskonto' })).toBeInTheDocument();
    });
});
