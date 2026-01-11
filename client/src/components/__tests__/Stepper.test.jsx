import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stepper from '../Stepper';

describe('Stepper Component', () => {
    it('renders all steps', () => {
        render(<Stepper currentStep={1} />);
        expect(screen.getByText('Vælg enhed')).toBeInTheDocument();
        expect(screen.getByText('Vælg reparation')).toBeInTheDocument();
        expect(screen.getByText('Færdiggør Ordre')).toBeInTheDocument();
    });

    it('highlights current and previous steps correctly', () => {
        render(<Stepper currentStep={2} />);

        // Step 1 (Completed) - Should have primary color
        // Step 1 (Completed) - Should have primary color
        const step1 = screen.getByText('1');
        expect(step1).toHaveAttribute('style', expect.stringMatching(/background:\s*var\(--primary\)/));

        // Step 2 (Active) - Should have primary color
        const step2 = screen.getByText('2');
        expect(step2).toHaveAttribute('style', expect.stringMatching(/background:\s*var\(--primary\)/));

        // Step 3 (Inactive) - Should have grey color
        const step3 = screen.getByText('3');
        expect(step3).toHaveAttribute('style', expect.stringMatching(/background:\s*(rgb\(226, 232, 240\)|#E2E8F0)/));
    });
});
