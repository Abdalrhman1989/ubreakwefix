import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CookieConsent from '../CookieConsent';

describe('CookieConsent Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // vi.useFakeTimers(); // Using real timers for reliability
    });

    afterEach(() => {
        // vi.useRealTimers();
    });

    it('does not render initially (delayed)', async () => {
        render(<CookieConsent />);
        expect(screen.queryByText(/This website uses cookies/i)).not.toBeInTheDocument();
        // Wait for the initial delay (1000ms) to pass to ensure it doesn't appear prematurely?
        // Actually, logic is: start hidden, timer starts.
        // We wait 500ms and check it's still hidden.
        await new Promise(r => setTimeout(r, 500));
        expect(screen.queryByText(/This website uses cookies/i)).not.toBeInTheDocument();
    }, 10000);

    it('renders after delay if no consent in localStorage', async () => {
        render(<CookieConsent />);

        // Wait for the delay (1000ms) + buffer
        await new Promise(r => setTimeout(r, 1100));

        expect(screen.getByText(/This website uses cookies/i)).toBeInTheDocument();
    }, 10000);

    it('does not show if already accepted', async () => {
        localStorage.setItem('cookieConsent', 'true');
        render(<CookieConsent />);
        // Wait briefly to ensure effect runs
        await new Promise(r => setTimeout(r, 100));
        expect(screen.queryByText(/This website uses cookies/i)).not.toBeInTheDocument();
    });

    it('accepts cookies and hides', async () => {
        render(<CookieConsent />);
        // Wait for appear
        await new Promise(r => setTimeout(r, 1100));

        expect(screen.getByText(/This website uses cookies/i)).toBeInTheDocument();

        const acceptBtn = screen.getByText('Allow All Cookies');
        fireEvent.click(acceptBtn);

        expect(localStorage.getItem('cookieConsent')).toBe('true');

        // Wait for fade out
        await new Promise(r => setTimeout(r, 600));
        expect(screen.queryByText(/This website uses cookies/i)).not.toBeInTheDocument();
    }, 10000);
});
