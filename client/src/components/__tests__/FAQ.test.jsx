import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQ from '../home/FAQ';

describe('FAQ Component', () => {
    it('renders faq items', () => {
        render(<FAQ />);
        expect(screen.getByText('Hvor lang tid tager en skærmreparation?')).toBeInTheDocument();
        expect(screen.getByText('Mister jeg min garanti ved reparation?')).toBeInTheDocument();
    });

    it('shows first answer by default', () => {
        render(<FAQ />);
        expect(screen.getByText(/En typisk skærmreparation/i)).toBeInTheDocument();
    });

    it('toggles answers on click', () => {
        render(<FAQ />);

        // Initial state: 1st open, 2nd closed
        const q1 = screen.getByText('Hvor lang tid tager en skærmreparation?');
        const q2 = screen.getByText('Mister jeg min garanti ved reparation?');

        expect(screen.getByText(/En typisk skærmreparation/i)).toBeInTheDocument();
        expect(screen.queryByText(/Vi bruger originale dele/i)).not.toBeInTheDocument();

        // Click 2nd question -> 1st closes, 2nd opens
        fireEvent.click(q2);

        expect(screen.queryByText(/En typisk skærmreparation/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Vi bruger originale dele/i)).toBeInTheDocument();

        // Click 2nd question again -> closes
        fireEvent.click(q2);
        expect(screen.queryByText(/Vi bruger originale dele/i)).not.toBeInTheDocument();
    });
});
