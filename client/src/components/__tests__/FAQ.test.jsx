import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQ from '../home/FAQ';

vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key) => key
    })
}));

describe('FAQ Component', () => {
    it('renders faq items', () => {
        render(<FAQ />);
        expect(screen.getByText('faq.q1')).toBeInTheDocument();
        expect(screen.getByText('faq.q2')).toBeInTheDocument();
    });

    it('shows first answer by default', () => {
        render(<FAQ />);
        expect(screen.getByText('faq.a1')).toBeInTheDocument();
    });

    it('toggles answers on click', () => {
        render(<FAQ />);

        // Initial state: 1st open, 2nd closed
        const q1 = screen.getByText('faq.q1');
        const q2 = screen.getByText('faq.q2');

        expect(screen.getByText('faq.a1')).toBeInTheDocument();
        expect(screen.queryByText('faq.a2')).not.toBeInTheDocument();

        // Click 2nd question -> 1st closes, 2nd opens
        fireEvent.click(q2);

        expect(screen.queryByText('faq.a1')).not.toBeInTheDocument();
        expect(screen.getByText('faq.a2')).toBeInTheDocument();

        // Click 2nd question again -> closes
        fireEvent.click(q2);
        expect(screen.queryByText('faq.a2')).not.toBeInTheDocument();
    });
});
