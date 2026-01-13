import { render, screen } from '@testing-library/react';
import BookingSection from '../home/BookingSection';
import { LanguageProvider } from '../../context/LanguageContext';
import { describe, it, expect } from 'vitest';
import React from 'react';

// Mock Lucide imports if necessary, but Vitest usually handles them.
// Mock translations if needed, but LanguageProvider uses the real file.

describe('BookingSection', () => {
    it('renders without crashing', () => {
        render(
            <LanguageProvider>
                <BookingSection />
            </LanguageProvider>
        );

        // Check for title
        expect(screen.getByText(/Online Booking/i)).toBeInTheDocument();

        // Check for form fields
        expect(screen.getByText(/Navn/i)).toBeInTheDocument(); // Assuming default language is Danish or English
    });
});
